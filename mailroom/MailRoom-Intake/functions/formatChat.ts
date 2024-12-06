// Import necessary modules
import * as AWS from 'aws-sdk';
import { getConfig } from '../config';
import { IResponse } from '../types';
import { Notification, timeout } from '../utilities';
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
   * what channel this lead came from (should always be 'chat')
   */
  channel: string;
  /**
   * the raw chat data
   */
  chat: any;
}

// Declare global variables
let config: any;

/**
 * The handler for this function
 * @param event - the event received by the lambda
 */
export const handler = async(event: any) => {
  console.log('Inside chat format function');

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

    // If this isn't a chat lead, throw an error
    if (parsedData.channel !== 'chat') throw new Error('A non-chat lead was received.');
    // If no chat data was provided, throw an error
    if (!parsedData.chat) throw new Error('No chat data provided.');

    // Initialize final data
    const finalData: any = {
      lead_id: parsedData.lead_id,
      channel: parsedData.channel,
    };

    // Process the data differently based on whether it was a ticket or not
    const processedChat = await processChat(parsedData.chat);

    // Store the app_key and fields top level
    finalData.fields = processedChat.fields;
    finalData.app_key = processedChat.app_key;
    finalData.campaign_id = processedChat.campaign_id;

    // If the app key or campaign id were not sent OR inferred, throw an error
    if (!finalData.app_key) throw new Error('We could not find an app key for the chat.');
    if (!finalData.campaign_id) throw new Error('We could not find a campaign id for the chat.');
      
    console.log(finalData);
    
    // Send the message to the next queue
    await timeout(sqs.sendMessage({
      MessageBody: JSON.stringify(finalData),
      QueueUrl: `${config.sqs.urls.prefix}mailroom-intake-${process.env.stage}-aggregate`,
    }).promise());

    // Form response
    response = {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Successfully formatted chat data'
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
            `Format Chat: ${err.message}`, 
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
 * Process the overall chat data 
 * @param raw - the raw chat data received by the handler
 */
const processChat = async(raw: any) => {
  // Initialize fields
  const fields: any = {};
  // Initialize the app_key and campaign_id (needed top level for the next micro-service)
  let app_key, campaign_id;

  // Determine whether this is a real chat or a chat ticket
  const isTicket = raw.event_type === 'ticket_created';

  // If this is a ticket, the actual information we need is nested in the events array
  const data = isTicket ? raw.ticket.events[0] : raw;

  // Extract chat ID
  fields.chat_id = isTicket ? raw.ticket.id : raw.chat.id;

  // Extract the referring chat url
  fields.initial_url = isTicket ? data.source.url : data.chat.url;
  
  // Extract the lead's email
  fields.email = isTicket ? data.author.id : data.visitor.email;

  // Extract the lead's name
  fields.full_name = isTicket ? data.author.name : data.visitor.name;

  // Add all other chat or ticket specific fields to our current fields object
  Object.assign(fields, isTicket ? getTicketFields(data) : getChatFields(data));

  // If the app_key was provided (stored in site_id for whatever reason), return it top level
  if (fields.site_id) {
    app_key = fields.site_id;
    delete fields.site_id;
  }
  // Otherwise, there was a problem and we need to determine the source
  else {
    // Extract the domain from the end of the live chat URL
    const domain = new URL(
      `https${unescape(fields.initial_url.replace('https://secure.livechatinc.com', '').split('https')[1])}`
    ).host.replace('www.', '');

    // Retrieve the app key from the DB API
    app_key = await getKeyFromDomain(domain);
  }

  // If the campaign_id was provided, return it top level
  if (fields.campaign_id) {
    campaign_id = fields.campaign_id;
    delete fields.campaign_id;
  }
  // Otherwise, there was a problem and we need to determine the route
  else {
    // Extract the domain from the end of the live chat URL
    const domain = new URL(
      `https${unescape(fields.initial_url.replace('https://secure.livechatinc.com', '').split('https')[1])}`
    ).host.replace('www.', '');

    // Set the campaign based on a fallback
    campaign_id = getFallbackCampaign(domain);
  }

  // TODO: If things break after launch, reevaluate if temp_referrer and it's
  // associated Rob's Rule need to be added

  // Return data
  return {
    fields,
    app_key,
    campaign_id
  };
};

/**
 * Retrieve chat specific fields
 * @param data - the chat data received by the handler
 */
const getChatFields = (data: any) => {
  // Initialize fields
  const fields: any = {};

  // Extract start time as ISO string
  fields.chat_start_time = new Date(data.chat.started_timestamp * 1000).toISOString();

  // If there is an end time provided, gather additional information
  if (data.chat.ended_timestamp) {
    fields.chat_end_time = new Date(data.chat.ended_timestamp * 1000).toISOString();
    fields.chat_duration = data.chat.ended_timestamp - data.chat.started_timestamp;
    fields.chat_type = 'posthook';
  }
  // If there was no end time, this was a pre-hook
  else fields.chat_type = 'prehook';

  // Form the chat transcript
  fields.chat_transcript = '';
  for (const message of data.chat.messages) {
    // Determine who was handling the chat
    if (!fields.chat_operator && message.user_type === 'agent') fields.chat_operator = message.author_name;

    // Prepend the name of the message creator to their message
    fields.chat_transcript += `${message.author_name}: ${message.text}\r\n`;
  }

  // Extract any custom variables
  if (data.visitor.custom_variables) {
    for (const variable of data.visitor.custom_variables) {
      fields[variable.key] = variable.value;
    }
  }

  // Loop through and extract the phone number (normal chat only)
  if (data.pre_chat_survey) {
    for (const question of data.pre_chat_survey) {
      if (question.label === 'Phone:' || question.label === 'Phone Number:') {
        fields.phone = question.answer;
        break;
      }
    }
  }

  // Return extra fields
  return fields;
};

/**
 * Retrieve ticket specific fields 
 * @param data - the ticket data received by the handler
 */
const getTicketFields = (data: any) => {
  // Initialize fields
  const fields: any = {};

  // Assign chat type (always ticket)
  fields.chat_type = 'ticket';

  // Loop through message and extract custom variables, phone number, and the actual message
  
  // Initialize the chat transcript
  fields.chat_transcript = '';
  // Parse the message into workable pieces
  const parsed = data.message.split('\n');
  // Boolean denoting when we have found the actual message section of the message
  let inMessage = false;
  // Boolean denoting when we have found the custom data section of the message
  let inCustomData = false;

  // Start loop over the parsed data to extract what we're looking for
  for (const message of parsed) {
    // If we have have found the custom data, continue to extract fields
    if (inCustomData) {
      // Break custom data into keyVal
      const keyVal = message.split(':');

      // Attach custom data to fields
      if (keyVal.length === 2) fields[keyVal[0]] = keyVal.slice(1).join(':').trim();
    }
    // If we have found the actual message, continue to extract it
    else if (inMessage) {
      // See if we have entered the custom data section
      if (message.includes('hasCustomData:')) {
        inCustomData = true;
        fields.hasCustomData = message.split(':')[1].trim();
      }
      // If not, just append the latest message to the transcript
      else {
        fields.chat_transcript += message.trim();
      }
    }
    // Otherwise, we have not found one of these sections
    else {
      // See if the phone number is in this piece (if so, extract it)
      if (message.includes('Phone Number:')) fields.phone = message.split(':')[1].trim();
      // Otherwise, just look for the start of the message section
      else if (message.includes('Message:')) inMessage = true;
    }
  }

  // Return extra fields
  return fields;
};

/**
 * Retrieve the correct app_key using the site's domain (used when chat is mal-formatted)
 * @param domain - the domain of the site
 */
const getKeyFromDomain = async(domain: string) => {
  // Retrieve the site details based on the domain provided
  const result = await fetch(`${config.api.homebase.url}/sites?domain=${domain}`,
    {
      headers: {
        'Accept': 'application/json',
        'X-AUTH-TOKEN': config.api.homebase.token
      }
    });

  // Extract the site details
  const site = await result.json();

  // Return the app key
  return site[0].appKey;
};

/**
 * Provide a fallback campaign id based on the domain
 * @param domain - the domain of the site
 */
const getFallbackCampaign = (domain: string) => {
  // These are the campaign id fallbacks for the properties that use live chat
  // If more properties are added with live chat, add a fallback campaign id here
  const fallbacks = {
    'asbestos.com': 6,
    'pleuralmesothelioma.com': 6,
    'mesotheliomaprognosis.com': 6,
    'annuity.org': 7,
    'structuredsettlements.com': 7
  };

  return fallbacks[domain];
};