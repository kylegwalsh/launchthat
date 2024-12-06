import { db } from '../database/db';
import { EndpointProvider } from '../providers/EndpointProvider';
import { getConfig } from '../config';
import { Notification, timeout } from '../utilities';
import AWS from 'aws-sdk';
AWS.config.update({ region: 'us-east-1' });
const sns = new AWS.SNS({ apiVersion: '2010-03-31' });

// Declare global variables
let config;

// Fires individual endpoints
export const handler = async (event) => {
  console.log('Firing endpoint');

  // Grab message
  const rawData = event.Records[0].Sns.Message;
  // const rawData = event.body;
  console.log(rawData);

  // Declare variables
  let id, fields, lead_id, lead_version, route, channel, site_name, retryCount, responseId;
  const response = {};
  let mailroom;

  try {
    // Get config
    config = await getConfig();

    // De-structure the request in relevant variables
    ({ id, fields, lead_id, lead_version, route, channel, site_name, retryCount, responseId } = JSON.parse(rawData));

    // Log which lead this is
    console.log(`Lead ID: ${lead_id}, Lead Version: ${lead_version}`);

    // *** Connect to database ***

    mailroom = await timeout(db.connect(config.db.mailroom));

    // *** Retrieve Endpoint from DB ***

    // Request initial endpoint object to determine what type of endpoint it is
    let result = await timeout(mailroom.execute(`SELECT type, type_id FROM endpoints WHERE id = ${id}`));
    const typeData = result[0][0];

    // Fetch real endpoint from the correct table (determined by it's type)
    switch (typeData.type) {
      case 'email':
        console.log('Email endpoint');
        result = await timeout(mailroom.execute(`SELECT * FROM email_endpoints WHERE id = ${typeData.type_id}`));
        break;
      case 'http':
        console.log('HTTP endpoint');
        result = await timeout(
          mailroom.execute(
            `SELECT * FROM field_maps RIGHT JOIN (SELECT * FROM http_endpoints WHERE id = ${
              typeData.type_id
            }) as endpoints ON endpoints.field_map_id = field_maps.id`
          )
        );
        break;
      default:
        throw new Error('Bad endpoint type supplied.');
    }

    // Request endpoint object from DB (with partner and field map details)
    const endpoint = result[0][0];
    // Add type so provider can use it to find which handler to use
    endpoint.type = typeData.type;
    // Overwrite the id so we can track the endpoint at a higher level
    endpoint.id = id;

    // *** Initialize Our Provider and Fire Endpoint ***

    // Initialize our endpointProvider to handle field parsing and provide other methods
    const endpointProvider = new EndpointProvider(endpoint, fields, lead_id, lead_version, route, channel, site_name, retryCount, responseId, config);
    await endpointProvider.fire();

    // Create response
    response.statusCode = 200;
    response.body = JSON.stringify({ message: 'Successfully routed lead' });
  } catch (err) {
    // Catch any errors
    console.log(err);

    // Create our error slack notification
    const params = {
      Message: JSON.stringify({
        app: {
          name: config.app.name,
          logo: config.app.logo,
          emoji: config.slack.emoji,
        },
        slack: await Notification.generateSlack('danger', config.slack.errorChannel, site_name, channel, route.name, `FireEndpoint: ${err.message}`, {
          lead_id: lead_id,
          lead_version: lead_version,
        }),
      }),
      TopicArn: config.sns.notification,
    };

    // Prevent function from crashing if SNS is the issue
    try {
      await sns.publish(params).promise();
    } catch (err2) {
      console.log(err2);
    }

    // Create response
    response.statusCode = 500;
    response.body = JSON.stringify({ message: 'Failed to fire endpoint' });
  }

  if (mailroom) mailroom.end();

  return response;
};
