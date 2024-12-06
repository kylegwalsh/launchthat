import { getConfig } from '../config';
import { db } from '../database/db';
import { Notification, timeout } from '../utilities';
import AWS from 'aws-sdk';
AWS.config.update({ region: 'us-east-1' });
const sns = new AWS.SNS({ apiVersion: '2010-03-31' });

// Declare global variables
let config;

// Handles endpoint responses
export const handler = async (event) => {
  console.log('Handling response.');

  // Grab data
  const sns = event.Records[0].Sns;
  const rawData = event.Records[0].Sns.Message;
  const topic = sns.TopicArn;
  // const rawData = event.body;
  console.log(rawData);

  // Declare variables
  let record, channel, route, site_name, lead_id, lead_version, endpoint_id, responseId;
  const response = {};
  let mailroom;

  try {
    // Get config
    config = await getConfig();

    // De-structure the request in relevant variables
    ({ record, channel, route, site_name, lead_id, lead_version, endpoint_id, responseId } = JSON.parse(rawData));
    // ({ topic, record, channel, route, site_name, lead_id, endpoint_id, responseId } = JSON.parse(rawData));

    // Log which lead this is
    console.log(`Lead ID: ${lead_id}, Lead Version: ${lead_version}`);

    // *** Connect to database ***

    // Push connection into promise array
    mailroom = await timeout(db.connect(config.db.mailroom));

    // *** Handle Response Based on Topic that Triggered Function ***

    // If there was an error firing the endpoint, process the error
    if (topic === `${config.sns.mailroomPrefix}endpointFailure`) {
      await timeout(processError(mailroom, record, lead_id, lead_version, site_name, channel, route, endpoint_id, responseId));
    }
    // If the endpoint was fired successfully, process the success
    else if (topic === `${config.sns.mailroomPrefix}endpointSuccess`) {
      await timeout(processSuccess(mailroom, record, lead_id, lead_version, endpoint_id, responseId, route));
    }

    // Create response
    response.statusCode = 200;
    response.body = JSON.stringify({ message: 'Response handled successfully.' });
  } catch (err) {
    // Catch any errors
    console.log(err);

    // Prevent function from crashing if SNS is the issue
    try {
      // Create our error slack notification
      await sendSlackMessage('danger', config.slack.errorChannel, site_name, channel, route.name, `HandleResponse: ${err.message}`, {
        lead_id: lead_id,
        lead_version: lead_version,
      });
    } catch (err2) {
      console.log(err2);
    }

    // Create response
    response.statusCode = 500;
    response.body = JSON.stringify({ message: 'Failed to handle response' });
  }

  if (mailroom) mailroom.end();

  // Return response
  return response;
};

// Process the endpoint fire failure (slack notification to error channel, response record updated, lead status set to 'failure')
const processError = async (mailroom, record, lead_id, lead_version, site_name, channel, route, endpoint_id, responseId) => {
  // Create array of promises so requests can be asynchronous
  const promises = [];

  // Send slack error message
  promises.push(
    sendSlackMessage(
      'danger',
      config.slack.errorChannel,
      site_name,
      channel,
      route.name,
      `Endpoint ${endpoint_id}: ${record.body ? JSON.stringify(record.body) : record.statusText}`,
      { lead_id: lead_id, lead_version: lead_version }
    )
  );

  // Insert response record if we're not refiring (responseID does not exists)
  if (!responseId) {
    promises.push(
      mailroom.execute(
        `INSERT INTO response_records (status_code, body, endpoint_id, reason_phrase, lead_id, lead_version) VALUES (${
          record.status
        }, "${JSON.stringify(record.body)
          .replace(/\\/g, '\\\\')
          .replace(/\\\\\"/g, '\\\\\\"')
          .replace(/\'/g, "''")
          .replace(/"/g, '\\"')}", ${endpoint_id}, "${record.statusText}", ${lead_id}, ${lead_version})`
      )
    );
  }
  // Update response record if we're refiring (responseID exists)
  else {
    promises.push(
      mailroom.execute(
        `UPDATE response_records SET status_code = ${record.status}, body = "${JSON.stringify(record.body)
          .replace(/\\/g, '\\\\')
          .replace(/\\\\\"/g, '\\\\\\"')
          .replace(/\'/g, "''")
          .replace(/"/g, '\\"')}", reason_phrase = "${record.statusText}" WHERE id = ${responseId}`
      )
    );
  }

  // Update lead status to 'failed'
  promises.push(mailroom.execute(`UPDATE leads SET delivery_status = "failed" WHERE id = ${lead_id} AND version = ${lead_version}`));

  // Return all of our promises
  return Promise.all(promises);
};

// Process the endpoint fire success (response record updated)
const processSuccess = async (mailroom, record, lead_id, lead_version, endpoint_id, responseId, route) => {
  // Insert response record if we're not refiring (responseID does not exists)
  if (!responseId) {
    await timeout(
      mailroom.execute(
        `INSERT INTO response_records (status_code, body, endpoint_id, reason_phrase, lead_id, lead_version) VALUES (${
          record.status
        }, "${JSON.stringify(record.body)
          .replace(/\\/g, '\\\\')
          .replace(/\\\\\"/g, '\\\\\\"')
          .replace(/\'/g, "''")
          .replace(/"/g, '\\"')}", ${endpoint_id}, "${record.statusText}", ${lead_id}, ${lead_version})`
      )
    );
  } else {
    // Update response record if we're refiring (responseID exists)
    await timeout(
      mailroom.execute(
        `UPDATE response_records SET status_code = ${record.status}, body = "${JSON.stringify(record.body)
          .replace(/\\/g, '\\\\')
          .replace(/\\\\\"/g, '\\\\\\"')
          .replace(/\'/g, "''")
          .replace(/"/g, '\\"')}", reason_phrase = "${record.statusText}" WHERE id = ${responseId}`
      )
    );
  }

  // After status is recorded...
  // Query tables to determine if lead fired successfully (number of success >= number of active endpoints)
  const promises = [];

  // Get number of active endpoints
  promises.push(
    mailroom.execute(
      `SELECT COUNT(*) as count FROM (SELECT endpoint_id FROM route_endpoint_maps WHERE route_id = ${
        route.id
      }) AS endpoint_match INNER JOIN (SELECT id FROM endpoints WHERE active = 1) as endpoints ON endpoint_match.endpoint_id = endpoints.id`
    )
  );
  // Get number of successful response records
  promises.push(
    mailroom.execute(
      `SELECT COUNT(*) as count FROM response_records WHERE lead_id = ${lead_id} AND lead_version = ${lead_version} AND status_code >= 200 AND status_code < 300`
    )
  );

  // Extract counts
  const counts = await Promise.all(promises);
  const endpointCount = counts[0][0][0].count;
  const successCount = counts[1][0][0].count;

  // If all the success records are in, update the lead status to success
  if (successCount >= endpointCount) {
    console.log('Lead fired successfully to all endpoints');
    return mailroom.execute(`UPDATE leads SET delivery_status = "success" WHERE id = ${lead_id} AND version = ${lead_version}`);
  }
  // Otherwise, just return
  return;
};

// Sends slack message to special channel
const sendSlackMessage = async (color, slack_channel, site_name, channel, route_name, error_message, leadDetails) => {
  // Create our slack message based on status of response record (error or success)
  const params = {
    Message: JSON.stringify({
      app: {
        name: config.app.name,
        logo: config.app.logo,
        emoji: config.slack.emoji,
      },
      slack: await Notification.generateSlack(color, slack_channel, site_name, channel, route_name, error_message, leadDetails),
    }),
    TopicArn: config.sns.notification,
  };

  // Return a promise of our notification
  return sns.publish(params).promise();
};
