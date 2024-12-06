// Import necessary modules
import * as AWS from 'aws-sdk';
import { getConfig } from '../config';
import { IResponse } from '../types';
import { Notification, Format, timeout } from '../utilities';
import * as fetch from 'node-fetch';
import * as Twig from 'twig';

// Configure AWS to use the correct region
AWS.config.update({ region: 'us-east-1' });
// Configure SQS
const sqs = new AWS.SQS({ apiVersion: '2012-11-05' });
// Configure SNS
const sns = new AWS.SNS({ apiVersion: '2010-03-31' });

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
   * the id corresponding to one of our sites
   */
  site_id: number;
  /**
   * the id corresponding to one of our verticals (TODO: remove once we are using campaign_id)
   */
  vertical_id?: number;
  /**
   * the id corresponding to one of our routes (TODO: remove once we are using campaign_id)
   */
  route_id?: number;
  /**
   * the additional campaign data for paid / default (used once we know the lead's attribution)
   */
  campaign_fields?: {
    /**
     * details to use if the lead is not paid
     */
    default: {
      /**
       * the route to send the lead to
       */
      route_id: number;
      /**
       * the additional fields to attach to the lead
       */
      fields: any;
    };
    /**
     * details to use if the lead is paid
     */
    paid: {
      /**
       * the route to send the lead to
       */
      route_id: number;
      /**
       * the additional fields to attach to the lead
       */
      fields: any;
    };
  };
}

// Declare global variables
let config: any;

/**
 * The handler for this function
 * @param event - the event received by the lambda
 */
export const handler = async(event: any) => {
  console.log('Inside normalize function');

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

    // Retrieve normalization rules from the DB
    const rules: { 
      version: number; 
      rules: IRules; 
    } = await timeout(getRules());

    // Normalize the data using the rules we retrieved from the database
    const finalFields = normalize(parsedData.fields, rules.rules, parsedData.channel);

    // Form the data object for the next function
    const finalData = {
      // Reattach most the data we received
      ...parsedData,
      // Attach the version of the normalizer
      rule_version: rules.version,
      // Overwrite the previous fields with our normalized fields
      fields: {
        ...finalFields,
        // Also add the luid to the fields
        luid: Format.generateLongLeadID(parsedData.lead_id)
      }
    };

    // Apply the additional campaign details now that attribution has been determined
    if (parsedData.campaign_fields) {
      // Select the route from the campaign details
      finalData.route_id = finalData.campaign_fields[finalData.fields.is_paid ? 'paid' : 'default'].route_id;
      // Add the campaign specific fields from the campaign details
      for (const key in finalData.campaign_fields[finalData.fields.is_paid ? 'paid' : 'default'].fields) {
        // Don't overwrite existing fields with campaign values
        if (!finalData.fields[key]) {
          finalData.fields[key] = finalData.campaign_fields[finalData.fields.is_paid ? 'paid' : 'default'].fields[key];
        }
      }

      // Delete the campaign_fields (no longer needed)
      delete finalData.campaign_fields;
    }
    // If no campaign details are provided, throw an error
    else {
      throw new Error('No campaign details provided (can\'t determine route!)');
    }

    // Check whether this is a test lead (and change it's route if so)
    if (checkForTest(finalData.fields.full_name)) finalData.route_id = 1;

    console.log(finalData);
    
    // Send the message to MailRoom-Core (SNS)
    await timeout(sns.publish({
      Message: JSON.stringify(finalData),
      TopicArn: `${config.sns.topics.prefix}mailroom-core-${process.env.stage}-newLead`,
    }).promise());

    // Form response
    response = {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Successfully normalized data'
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
            `Normalize: ${err.message}`, 
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
 * The properties associated with a rule
 */
interface IRules {
  /**
   * rules to apply to web channel
   */
  web?: [
    {
      /**
       * the key (name) of the field you're overwriting or creating
       */
      key: string;
      /**
       * the twig rules that will be used to generate the value (or hard coded value)
       */
      value: string;
    }
  ];
  /**
   * rules to apply to call channel
   */
  call?: [
    {
      /**
       * the key (name) of the field you're overwriting or creating
       */
      key: string;
      /**
       * the twig rules that will be used to generate the value (or hard coded value)
       */
      value: string;
    }
  ];
  /**
   * rules to apply to facebook channel
   */
  facebook?: [
    {
      /**
       * the key (name) of the field you're overwriting or creating
       */
      key: string;
      /**
       * the twig rules that will be used to generate the value (or hard coded value)
       */
      value: string;
    }
  ];
  /**
   * rules to apply to call channel
   */
  chat?: [
    {
      /**
       * the key (name) of the field you're overwriting or creating
       */
      key: string;
      /**
       * the twig rules that will be used to generate the value (or hard coded value)
       */
      value: string;
    }
  ];
  /**
   * rules to apply to all channels
   */
  general?: [
    {
      /**
       * the key (name) of the field you're overwriting or creating
       */
      key: string;
      /**
       * the twig rules that will be used to generate the value (or hard coded value)
       */
      value: string;
    }
  ];
}

/**
 * Retrieve the rules from the database
 */
const getRules = async() => {
  // Retrieve the config
  const config = await getConfig();

  // Retrieve the latest normalization rules from the DB
  const rulesRequest = await fetch(`${config.api.homebase.url}/rules?order[version]=desc`,
    {
      headers: {
        'Accept': 'application/json',
        'X-AUTH-TOKEN': config.api.homebase.token
      }
    });

  // Extract rules from response
  const rulesArr = await rulesRequest.json();

  // If we cannot retrieve the rules from the database, throw an error
  if (!rulesArr || !rulesArr.length) throw new Error('Could not retrieve rules from the database');

  // Return the only rule in the array
  return {
    version: rulesArr[0].version,
    rules: rulesArr[0].rules
  };
};

/**
 * Normalize the fields using the given rules
 */
const normalize = (fields: any, rules: IRules, channel: string) => {
  console.log('Normalizing');

  // Make the pipeExtract function available to twig
  Twig.extendFunction('pipeExtract', pipeExtract);

  // Loop through our channel based rules and use them to generate / overwrite fields
  if (rules[channel] && rules[channel].length) {
    for (const rule of rules[channel]) {
      // Turn the rule value into a twig rule
      const twigRule = Twig.twig({
        data: rule.value
      });

      // Evaluate the rule
      const output = twigRule.render(fields);

      // Store the result of the rule in the given field
      // (if the value is 0 or 1, parse it into a number)
      fields[rule.key] = (output === '0' || output === '1') ?
        Number.parseInt(output, 10) : 
        output;
    }
  }

  // Loop through our general rules and use them to generate / overwrite fields
  if (rules.general && rules.general.length) {
    for (const rule of rules.general) {
      // Turn the rule value into a twig rule
      const twigRule = Twig.twig({
        data: rule.value
      });

      // Evaluate the rule
      const output = twigRule.render(fields);

      // Store the result of the rule in the given field
      // (if the value is 0 or 1, parse it into a number)
      fields[rule.key] = (output === '0' || output === '1') ? Number.parseInt(output, 10) : output;
    }
  }

  return fields;
};

/**
 * Helper twig function to extract any attributes in a piped string
 * Ex. pipeExtract('utm_source', 'utm_source=this|other_field=that') = 'this'
 * @param key - the key you are searching for in the string
 * @param pipedInput - the string with pipes that contains the key / values
 */
const pipeExtract = (key: string, pipedInput: string) => {
  // If the pipedInput is empty, return undefined
  if (!pipedInput) return undefined;
  
  // Initialize the object where we'll store the parsed key / values
  const fields = {};

  // Split the pipedInput into key / values based on the pipe locations
  const result = pipedInput.split('|');
  
  // Loop through the key / values to split them into an object
  for (const keyVal of result) {
    // Extract the key and value
    const [k, v] = keyVal.split('='); 
    
    // If the key is defined, store it's value for later
    if (k) {
      fields[k] = v;
    }
  }
  
  // Return the value of the key we're interested in
  return fields[key];
};

/**
 * Check whether the full name of the lead is beau test (test lead)
 * and then return the whether this is a test lead
 * @param fullName - the full name of the person who submitted the lead
 */
const checkForTest = (fullName: string) => {
  const formattedName = fullName.trim().toLowerCase();

  // If this is a beau test, return 1 (the id of the test route)
  if (formattedName === 'beau test') return true;
  // Otherwise return the previous route id
  return false;
};