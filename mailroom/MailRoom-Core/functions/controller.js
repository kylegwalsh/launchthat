import { getConfig } from '../config';
import AWS from 'aws-sdk';
AWS.config.update({ region: 'us-east-1' });
const sns = new AWS.SNS({ apiVersion: '2010-03-31' });
import { db } from '../database/db';
import { Notification, Format, timeout } from '../utilities';

// Declare global variables
let config;

// Handles new leads from PipeThat
export const handler = async (event) => {
  console.log('Inside controller');

  // Grab message
  const rawData = event.Records[0].Sns.Message;
  // const rawData = event.body;
  console.log(rawData);

  // Declare variables
  let lead_id, route_id, site_id, vertical_id, fields, channel, route_name, rule_version;
  let mailroom, homebase;
  const response = {};
  let promises = [];
  let params = {};
  let vertical = {};
  let site = {};
  let lead_version;

  try {
    // Get config
    config = await getConfig();

    // TODO: Remove legacy extraction from form_params field (should all be top level in new intake system)
    // De-structure the request in relevant variables
    const parsedData = JSON.parse(rawData);
    ({ lead_id, route_id, site_id, vertical_id, fields, channel, rule_version } = parsedData.form_params ? parsedData.form_params : parsedData);

    // Log which lead this is
    console.log(`Lead ID: ${lead_id}`);

    // *** Connect to databases ***

    promises.push(timeout(db.connect(config.db.mailroom)));
    promises.push(timeout(db.connect(config.db.homebase)));
    let result = await Promise.all(promises);

    mailroom = result[0];
    homebase = result[1];

    // Clear promises array so it can be reused
    promises = [];

    // *** Retrieve DB Details from Mailroom and Homebase, then Create Lead ***

    // Format fields for DB
    const strField = JSON.stringify(fields)
      .replace(/\\/g, '\\\\')
      .replace(/\\\\\"/g, '\\\\\\"')
      .replace(/\'/g, "''");

    // Push request for endpoints associated with route into our promise array (retrieve endpoint details)
    promises.push(
      timeout(
        mailroom.execute(
          `SELECT id, active FROM (SELECT endpoint_id FROM route_endpoint_maps WHERE route_id = "${route_id}") AS endpoint_match INNER JOIN endpoints ON endpoint_match.endpoint_id = endpoints.id`
        )
      )
    );

    // Push request for vertical into our promise array (retrieve vertical details)
    promises.push(
      timeout(homebase.execute(`SELECT name, lead_email, lead_slack, lead_email_test, lead_slack_test FROM verticals WHERE id = ${vertical_id}`))
    );

    // Push request for site into our promise array (retrieve site details)
    promises.push(timeout(homebase.execute(`SELECT active, name FROM sites WHERE id = ${site_id}`)));

    // Push request for route into our promise array (retrieve route name)
    promises.push(timeout(homebase.execute(`SELECT name FROM routes WHERE id = ${route_id}`)));

    // Push request for internal email field map into our promise array (retrieve internal email field map)
    promises.push(timeout(mailroom.execute('SELECT field_map FROM field_maps WHERE internal_email = 1')));

    // Get the number of leads in the DB with the same lead id (used to determine lead version)
    promises.push(timeout(mailroom.execute(`SELECT MAX(version) as version FROM leads WHERE id = ${lead_id}`)));

    // Wait for the retrieval of the campaign and site from the DB
    result = await Promise.all(promises);

    // Extract endpoints from result
    const endpoints = result[0][0];

    // Extract vertical from result
    vertical = result[1][0][0];

    // Extract site from result
    site = result[2][0][0];

    // Extract route from result
    route_name = result[3][0][0].name;

    // Determine the version of the lead
    lead_version = result[5][0][0].version ? result[5][0][0].version + 1 : 1;
    console.log(`Lead version: ${lead_version}`);

    // Store new lead in database (or update duplicate)
    await timeout(
      mailroom.execute(
        `INSERT INTO leads (id, version, fields, vertical_id, site_id, route_id, channel, delivery_status, rule_version) VALUES (${lead_id}, ${lead_version}, '${strField}', ${vertical_id}, ${site_id}, ${route_id}, "${channel}", "${
          site.active ? 'unsent' : 'inactive'
        }", ${rule_version ||
          1}) ON DUPLICATE KEY UPDATE fields = VALUES(fields), vertical_id = VALUES(vertical_id), site_id = VALUES(site_id), route_id = VALUES(route_id), channel = VALUES(channel), delivery_status = "${
          site.active ? 'unsent' : 'inactive'
        }", rule_version = VALUES(rule_version)`
      )
    );

    // Extract field map from result (if there is more than one, or none, then just leave it undefined)
    const field_map = result[4][0] && result[4][0].length === 1 && result[4][0][0].field_map ? result[4][0][0].field_map : undefined;

    // Clear promises array so it can be reused
    promises = [];

    // *** Send Vertical Level Notifications ***

    // If the site is active
    if (site.active && lead_version === 1) {
      // If the route is the test route (id of 1), send the test notifications
      if (route_id === 1)
        promises.push(
          sendVerticalNotifications(
            vertical.lead_slack_test,
            vertical.lead_email_test,
            fields,
            channel,
            lead_id,
            lead_version,
            route_name,
            field_map,
            site.name
          )
        );
      // Otherwise, send normal notifications
      else
        promises.push(
          sendVerticalNotifications(
            vertical.lead_slack,
            vertical.lead_email,
            fields,
            channel,
            lead_id,
            lead_version,
            route_name,
            field_map,
            site.name
          )
        );
    }

    // *** Send Global Slack Notification ***

    // Create our message payload for the additional slack #lead-info channel
    params = {
      Message: JSON.stringify({
        app: {
          name: config.app.name,
          logo: config.app.logo,
          emoji: config.slack.emoji,
        },
        slack: await Notification.generateSlack('good', config.slack.infoChannel, site.name, channel, route_name, undefined, {
          full_name: fields.full_name,
          phone: fields.phone,
          lead_attribution: fields.lead_attribution,
          invoca_call_duration: fields.invoca_call_duration,
          lead_id: lead_id,
          lead_version: lead_version,
          w_url: fields.w_url,
        }),
      }),
      TopicArn: config.sns.notification,
    };

    // Push notification into promise array
    promises.push(sns.publish(params).promise());

    // Wait for all notifications to send before firing endpoints
    await Promise.all(promises);

    // Clear promises so it can be reused to fire endpoints
    promises = [];

    // *** Fire Endpoints ***

    // If the site is active
    if (site.active) {
      // Boolean tracking whether any endpoints fired
      let noEndpoints = true;

      // Loop through each endpoint of the campaign and fire it
      endpoints.forEach((endpoint) => {
        if (endpoint.active) {
          console.log('Firing: ' + endpoint.id);

          // We found at least one active endpoint
          noEndpoints = false;

          // Set up the SNS configuration to fire each endpoint
          params = {
            Message: JSON.stringify({
              id: endpoint.id,
              fields: fields,
              lead_id: lead_id,
              lead_version: lead_version,
              route: {
                id: route_id,
                name: route_name,
              },
              channel: channel,
              site_name: site.name,
            }),
            TopicArn: `${config.sns.mailroomPrefix}fireEndpoint`,
          };

          // Push each endpoint fire into our promise array (Send SNS topic to trigger fireEndpoint)
          promises.push(sns.publish(params).promise());
        }
      });

      // If no endpoints were active, set lead status to inactive
      if (noEndpoints) {
        console.log('No endpoints active');
        await timeout(mailroom.execute(`UPDATE leads SET delivery_status = "inactive" WHERE id = ${lead_id} AND version = ${lead_version}`));
      }
    }

    // Wait for all our endpoints to fire and for site level notifications to complete
    await Promise.all(promises);

    // Create response
    response.statusCode = 200;
    response.body = JSON.stringify({ message: 'Successfully routed lead' });
  } catch (err) {
    // Catch any errors
    console.log(err);

    // Create our error slack notification
    params = {
      Message: JSON.stringify({
        app: {
          name: config.app.name,
          logo: config.app.logo,
          emoji: config.slack.emoji,
        },
        slack: await Notification.generateSlack('danger', config.slack.errorChannel, site.name, channel, route_name, `Controller: ${err.message}`, {
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
    response.body = JSON.stringify({ message: 'Failed to route lead' });
  }

  // End DB connections
  if (mailroom) mailroom.end();
  if (homebase) homebase.end();

  return response;
};

// Send notifications to the emails associated with the vertical
const sendVerticalNotifications = async (slack_channel, email, fields, channel, lead_id, lead_version, route_name, field_map, site_name) => {
  let params, emailFields;
  // If an internal field map is supplied, format the fields for the email notification
  if (field_map) {
    console.log('Field map found!');
    emailFields = Format.mapFields(fields, field_map, true, true);
  }
  // Otherwise, send an error to slack stating one is needed
  else {
    console.log('No field map!');
    params = {
      Message: JSON.stringify({
        app: {
          name: config.app.name,
          logo: config.app.logo,
          emoji: config.slack.emoji,
        },
        slack: await Notification.generateSlack(
          'warning',
          config.slack.errorChannel,
          undefined,
          undefined,
          undefined,
          'Error loading internal email field map. Make sure one (and only one) field map has internal_email box checked.'
        ),
      }),
      TopicArn: config.sns.notification,
    };

    await sns.publish(params).promise();

    // Fake email mapping for internal email
    emailFields = {
      'Other Details': {
        ...fields,
      },
    };
  }

  // Create our message payload for the site level notifications
  params = {
    Message: JSON.stringify({
      app: {
        name: config.app.name,
        logo: config.app.logo,
        emoji: config.slack.emoji,
      },
      email: await Notification.generateEmail(email, route_name, emailFields, { reply_to: 'no-reply@launchthat.com' }, lead_id),
      slack: await Notification.generateSlack('good', slack_channel, site_name, channel, undefined, undefined, {
        full_name: fields.full_name,
        phone: fields.phone,
        lead_attribution: fields.lead_attribution,
        invoca_call_duration: fields.invoca_call_duration,
        lead_id: lead_id,
        lead_version: lead_version,
        w_url: fields.w_url,
      }),
    }),
    TopicArn: config.sns.notification,
  };

  // Push our site level notification into our promise array (Send SNS topic to trigger notification)
  return sns.publish(params).promise();
};
