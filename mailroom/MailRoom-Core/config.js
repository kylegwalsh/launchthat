/**
 * Configuration file used across this application.
 * To add endpoints, include below in endpoints property.
 * It will automatically resolve requests to these config settings
 *
 */

// Use AWS Parameter store to get values
import AWS from 'aws-sdk';
const ssm = new AWS.SSM({ apiVersion: '2014-11-06' });

let config = null;

export const getConfig = async () => {
  // If config was already created by a previous import, return it
  if (config) return config;

  // Otherwise, retrieve it from AWS parameter store (below)

  // Secure values to fetch
  const params = {
    Names: [
      `applications-database-${process.env.stage}-host`,
      `applications-database-${process.env.stage}-user`,
      `applications-database-${process.env.stage}-password`,
      'mailgun-key',
      'slack-hook',
    ],
    WithDecryption: true,
  };

  // Get values from AWS
  const result = await ssm.getParameters(params).promise();
  const secureValues = {};

  // Extract params from result
  for (let i = 0; i < result.Parameters.length; i++) {
    secureValues[result.Parameters[i].Name] = result.Parameters[i].Value;
  }

  config = {
    app: {
      name: 'Mail Room',
      logo: 'https://s3.amazonaws.com/lt-public-assets/images/mailroom-logo.png',
    },
    mailRoomURL: 'https://mailroom.launchthat.com',
    sns: {
      mailroomPrefix: `arn:aws:sns:us-east-1:382977655890:mailroom-core-${process.env.stage}-`,
      notification: `arn:aws:sns:us-east-1:382977655890:notification-${process.env.stage}`,
    },
    db: {
      mailroom: {
        database: 'mailroom',
        host: secureValues[`applications-database-${process.env.stage}-host`],
        user: secureValues[`applications-database-${process.env.stage}-user`],
        password: secureValues[`applications-database-${process.env.stage}-password`],
        dialect: 'mysql',
      },
      homebase: {
        database: 'homebase',
        host: secureValues[`applications-database-${process.env.stage}-host`],
        user: secureValues[`applications-database-${process.env.stage}-user`],
        password: secureValues[`applications-database-${process.env.stage}-password`],
        dialect: 'mysql',
      },
    },
    mailgun: {
      apiKey: secureValues['mailgun-key'],
      domain: 'launchthat.com',
      fromEmail: 'no-reply@launchthat.com',
      fromName: 'Mail Room',
      logoURL: 'https://s3.amazonaws.com/lt-public-assets/images/mailroom-logo.png',
    },
    slack: {
      webHookURL: secureValues['slack-hook'],
      infoChannel: process.env.stage === 'prod' ? 'lead-info' : 'mars-testing',
      errorChannel: process.env.stage === 'prod' ? 'lead-error' : 'mars-testing',
      emoji: ':postbox:',
    },
  };

  return config;
};
