/**
 * Configuration file used across this application.
 */

// Use AWS Parameter store to get values
import * as AWS from 'aws-sdk';
const ssm = new AWS.SSM({ apiVersion: '2014-11-06' });

let config = null;

/**
 * Function to retrieve the config
 */
export const getConfig = async() => {
  // If config was already created by a previous import, return it
  if (config) return config;

  // Otherwise generate it

  // *** RETRIEVE AWS SSM PARAMETERS ***

  // Secure values to fetch from AWS SSM
  const params = {
    Names: [
      'woopra-api-secret',
      `applications-api-${process.env.stage}-token`
    ],
    WithDecryption: true
  };

  // Get values from AWS
  const result = await ssm.getParameters(params).promise();
  const secureValues = {};

  // Extract params from result
  for (let i = 0; i < result.Parameters.length; i++) {
    secureValues[result.Parameters[i].Name] = result.Parameters[i].Value;
  }

  // *** END RETRIEVE AWS SSM PARAMETERS ***

  /**
   * Configuration for the app
   */
  config = {
    /**
     * details related to the overall application
     */
    app: {
      /**
       * the name of the app
       */
      name: 'Mail Room (Intake)',
      /**
       * only needed for sending emails currently - url where the app's logo is hosted (probably an s3 URL)
       */
      logo: 'https://s3.amazonaws.com/lt-public-assets/images/mailroom-logo.png'
    },
    /**
     * sns fields
     */
    sns: {
      /**
       * information related to sns topics
       */
      topics: {
       /**
        * the prefix for sns topics
        */
        prefix: `arn:aws:sns:us-east-1:382977655890:`
      }
    },
    /**
     * sqs fields
     */
    sqs: {
      /**
       * information related to queue URLs
       */
      urls: {
        /**
         * the prefix that should be attached to sqs queue URLs
         */
        prefix: 'https://sqs.us-east-1.amazonaws.com/382977655890/',
        /**
         * the entire URL for the notification queue URL
         */
        notification: `https://sqs.us-east-1.amazonaws.com/382977655890/notification-${process.env.stage}`
      }
    },
    /**
     * storage endpoint details
     */
    storage: {
      /**
       * s3 details
       */
      s3: {
        /**
         * the endpoint for the s3 storage endpoint
         */
        endpoint: `https://zfmyyfnbyi.execute-api.us-east-1.amazonaws.com/${process.env.stage}/storage/s3`,
        /**
         * the bucket where things should be stored
         */
        bucket: `mailroom-intake-aggregate-${process.env.stage}`
      }
    },
    /**
     * api connection details
     */
    api: {
      /**
       * homebase connection details
       */
      homebase: {
        /**
         * the url to use for homebase
         */
        url: process.env.stage === 'prod' ? 'https://homebase-api.launchthat.com/api' : 'http://34.239.143.199/api',
        /**
         * the key used to authenticate with the homebase api
         */
        token: secureValues[`applications-api-${process.env.stage}-token`]
      }
    },
    /**
     * slack settings
     */
    slack: {
      /**
       * which channel to send error notifications to
       */
      errorChannel: process.env.stage === 'prod' ? 'app-errors' : 'mars-testing',
      /**
       * what emoji to use in notifications
       */
      emoji: ':postbox:',
    },
    /**
     * woopra credentials
     */
    woopra: {
      appId: 'Mailroom',
      secret: secureValues[`woopra-api-secret`]
    }
  };

  return config;
};