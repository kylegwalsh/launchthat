// Import necessary modules
import * as AWS from 'aws-sdk';
import { getConfig } from '../config';
import { IResponse } from '../types';
import { Notification, timeout, Format, Storage } from '../utilities';
import * as fetch from 'node-fetch';

// Configure AWS to use the correct region
AWS.config.update({ region: 'us-east-1' });
// Configure SQS
const sqs = new AWS.SQS({ apiVersion: '2012-11-05' });

/**
 * The expected event body for the function
 */
interface IBody {
  /**
   * the id of the lead coming in
   */
  lead_id: string;
  /**
   * what channel this lead came from
   */
  channel: string;
  /**
   * the fields associated with the lead
   */
  fields: any;
  /**
   * the key associated with one of the sites (used to look up the correct origin)
   */
  app_key: string;
  /**
   * the id corresponding to the campaign the lead came from (determines route, vertical, and additional fields)
   */
  campaign_id?: number;
}

// Declare global variables
let config: any;

/**
 * The handler for this function
 * @param event - the event received by the lambda
 */
export const handler = async(event: any) => {
  console.log('Inside aggregate function');

  // Declare variables
  let response: IResponse = {};
  let parsedData: IBody;

  try {
    // Grab message from SQS or HTTP (Always log the raw before working with it)
    const rawData = event.Records ? event.Records[0].body : event.body;
    console.log(rawData);

    // Get the config (asynchronous)
    config = await timeout(getConfig());

    // Parse the input and make sure it adheres to the body interface
    parsedData = JSON.parse(rawData);

    // Retrieve additional data from the database and external endpoints (8 minute timeout)
    const finalData = await timeout(getAdditionalData(parsedData), 480000);

    console.log(finalData);
    
    // Send the message to the next queue
    await timeout(sqs.sendMessage({
      MessageBody: JSON.stringify(finalData),
      QueueUrl: `${config.sqs.urls.prefix}mailroom-intake-${process.env.stage}-normalize`,
    }).promise());

    // Form response
    response = {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Successfully aggregated data'
      }),
    };
  }
  // Catch any errors and send a notification
  catch (err) {
    console.log(err);
    
    try {
      // Send slack error message
      await timeout(sqs.sendMessage({
        MessageBody: JSON.stringify({
          slack: await Notification.generateSlack(
            config.slack.errorChannel, 
            'danger', 
            `Aggregate: ${err.message}`, 
            'Error :x:', 
            parsedData.lead_id
          )
        }),
        QueueUrl: `${config.sqs.urls.notification}`,
      }).promise());
    } 
    // Prevent function from crashing if SQS is the issue
    catch (err2) {
      console.log(err2);
    }

    // Create response
    response = {
      statusCode: 500,
      body: JSON.stringify({ message: err })
    };
  }

  // Send response
  return response;
};

/**
 * Retrieve additional data from the database and external endpoints.
 * @param initialData - the initial data that should be added to
 * @returns {object} finalData - the original data concatenated with the new data
 */
const getAdditionalData = async(initialData: IBody) => {
  // Initialize the data we're working with to match the initial data
  const workingData: any = initialData;
  
  // **** GET DETAILS FROM DB ****

  // Retrieve the site details from the DB
  const site = await getSiteDetails(initialData.app_key);
  console.log('Site: ', site);

  // Verify the website exists (a valid app_key was provided)
  if (!site.id) throw new Error('Unable to retrieve site information (check app key and permissions)');

  // Attach new site fields to the overall data object (site_id is top level, source is field level)
  workingData.site_id = site.id;
  workingData.fields.source = site.name;
  // Delete the app_key (it will not be used again)
  delete workingData.app_key;

  // If the website is providing a campaign_id, use it to determine vertical, route, and extra fields
  if (initialData.campaign_id) {
    const campaignDetails = await getCampaignDetails(initialData.campaign_id);
    console.log('Campaign: ', campaignDetails);

    // Add the campaign details to our data object
    workingData.vertical_id = campaignDetails.vertical_id;
    workingData.campaign_fields = {
      default: campaignDetails.default,
      paid: campaignDetails.paid
    };

    // We no longer need the campaign id
    delete workingData.campaign_id;
  }
  // If we are not given a campaign_id then we can't route!
  else {
    // Throw an error
    throw new Error('Missing campaign_id (can\'t determine destination)');
  }

  // **** END GET DETAILS FROM DB ****

  // **** GET EXTERNAL DATA ****

  // Retrieve data from Woopra if a wookie_id is provided
  if (workingData.fields && workingData.fields.wookie_id) {
    const woopraData = await processWoopra(workingData, site.domain);

    // Add woopra data to the fields object
    workingData.fields = { ...workingData.fields, ...woopraData };
  }

  // **** END GET EXTERNAL DATA ****

  // Return the aggregated data
  return workingData;
};

/**
 * Retrieve the site details from homebase
 * @param appKey - the key associated with one of the sites (used to look up the correct origin)
 * @returns {object} siteData - the data related to the site in homebase
 */
const getSiteDetails = async(appKey: string) => {
  // Query the homebase API for the site information
  const result = await fetch(`${config.api.homebase.url}/sites?appKey=${appKey}`,
    {
      headers: {
        'Accept': 'application/json',
        'X-AUTH-TOKEN': config.api.homebase.token
      }
    });
  
  const siteData = await result.json();

  return siteData[0];
};

/**
 * Retrieve the campaign details from homebase
 * @param campaignId - the id of the campaign to grab the information from
 * @returns {object} campaignData - the data related to the campaign in homebase
 */
const getCampaignDetails = async(campaignId: number) => {
  // Query the homebase API for the campaign information
  const result = await fetch(`${config.api.homebase.url}/campaign_details/?id=${campaignId}`, {
    headers: {
      'Accept': 'application/json',
      'X-AUTH-TOKEN': config.api.homebase.token
    }
  });
  const campaignData = await result.json();

  // Throw an error if the campaign could not be found
  if (!campaignData || !campaignData.vertical_id) {
    throw new Error(`Campaign with id ${campaignId} could not be found`);
  }

  return campaignData;
};

/**
 * The properties that are expected from the woopra session (actions) endpoint
 */
interface IWoopraSession {
  /**
   * the overall object encapsulating woopra events (extract events from timeline[0])
   */
  timeline: {
    /**
     * the array of woopra events
     */
    events: {
      /**
       * the data relating to the event
       */
      payload: {
        /**
         * the name of the event
         */
        name: string;
        /**
         * an array of props associated with the event (looks like ['qp_utm_term', 'qp_utm_term', 'VALUE'])
         */
        props: string[][];
        // Other values are returned here, but we're using the one's above
      };
      /**
       * denotes the type of event (we're interested in 'event' and 'session_started')
       */
      type: string;
    }[];
  }[];
}

/**
 * Fire conversion event and retrieve attribution data
 * @param data - the current data object to be added to
 * @param domain - the domain used to query woopra (used as the woopra project)
 * @returns {object} woopraData - the data retrieved from woopra
 */
const processWoopra = async(data: IBody, domain: string) => {
  // Keep an array of promises to allow for asynchronous requests
  const promises = [];

  // Push a custom conversion event into woopra
  promises.push(fetch('https://www.woopra.com/track/ce', {
    method: 'POST',
    body: JSON.stringify({
      // Which project (based on site domain)
      project: domain,
      // The user's identifying cookie
      cookie: data.fields.wookie_id,
      // The session timeout length after the conversion (30 minutes)
      timeout: 1800000,
      // The event name
      event: 'Conversion',
      // Additional properties to attach to the conversion event
      ce_luid: Format.generateLongLeadID(data.lead_id),
      ce_type: Format.titleCase(data.channel)
    }),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${new Buffer(config.woopra.appId + ':' + config.woopra.secret).toString('base64')}`
    }
  }));

  // Retrieve all pageviews (and query params) associated with the lead's session
  promises.push(fetch('https://www.woopra.com/rest/3.0/profile/actions', {
    method: 'POST',
    body: JSON.stringify({
      // Which project (based on site domain)
      project: domain,
      // The user's identifying cookie
      cookie: data.fields.wookie_id,
      // How many days to look back on and retrieve
      limit: 1,
      // Only retrieve page view events
      filters: '["pv"]'
    }),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${new Buffer(config.woopra.appId + ':' + config.woopra.secret).toString('base64')}`
    }
  }));

  // Retrieve all pageviews (and query params) associated with the lead's session
  promises.push(Storage.getJSON({
    bucket: config.storage.s3.bucket,
    fileName: `${data.lead_id}.json`,
    path: 'woopra'
  }));

  // Wait for all requests to complete
  const results = await Promise.all(promises);

  // Attempt to process the user's woopra session data
  try {
    if (results[2].ok) console.log('Using the woopra data retrieved from S3');

    // If the s3 request was successful, then this is an old lead that we have already stored
    // the woopra data for (use the s3 session). Otherwise, use the woopra result
    const session: IWoopraSession = await results[results[2].ok ? 2 : 1].json();

    // Extract the events from the session
    const events = session.timeline[0].events;

    // Store the woopra session in S3 in case we need to query it later
    if (!results[2].ok && events) {
      await Storage.storeJSON({
        content: session,
        bucket: config.storage.s3.bucket,
        fileName: `${data.lead_id}.json`,
        path: 'woopra'
      });
    }

    // Initialize the woopra variables we're looking for
    const queryParams = {};
    const clickPath: string[] = [];
    let firstPage, lastPage;

    // Loop through the session events (construct click path and grab attribution / query params)
    for (const event of events) {
      // If we reach the start of the session, exit (attribution only comes from current session)
      if (event.type === 'session_started') break;
      // We're only interested in page view events (pv)
      else if (event.type === 'event' && event.payload.name === 'pv') {
        // Loop through it's props and extract all query params (and the URL for click path)
        for (const prop of event.payload.props) {
          // See if the prop is name spaced with qp_ (it is a query param)
          if (prop[0].slice(0, 3) === 'qp_') {
            // If the query param was not already set (and the value is not blank), store it
            if (!queryParams[prop[0]] && prop[2]) queryParams[prop[0]] = prop[2];
          }
          // Check whether the prop is the url (for click path)
          else if (prop[0] === 'url') {
            // Store the URL in the click path
            clickPath.unshift(prop[2]);
          }
        }
      }
    }

    // Set first page to the first page in the click path
    firstPage = clickPath[0];

    // Set conversion page (start at the end of the click path array and remove any thank you pages)
    for (let i = clickPath.length - 1; i >= 0; i--) {
      // Remove any thank you pages from the end
      if (!clickPath[i].includes('thank')) lastPage = clickPath[i];
      // Leave the for loop once we find a non-thank you page
      else break;
    }

    // Return the woopra data
    return {
      ...queryParams,
      click_path: JSON.stringify(clickPath),
      first_page: firstPage,
      conv_page: lastPage
    };
  }
  // If we were unable to process the session data, send a warning message to the error channel
  catch (err) {
    console.log(err);

    // Prevent function from crashing if SQS is the issue
    try {
      // Send slack error message
      await sqs.sendMessage({
        MessageBody: JSON.stringify({
          slack: await Notification.generateSlack(
            config.slack.errorChannel,
            'warning',
            'Aggregate: wookie_id exists, but woopra did not provide any session details (unable to check attribution for this lead)',
            'Warning :warning:',
            data.lead_id
          )
        }),
        QueueUrl: `${config.sqs.urls.notification}`,
      }).promise();
    } catch (err) {
      console.log(err);
    }
  }
};