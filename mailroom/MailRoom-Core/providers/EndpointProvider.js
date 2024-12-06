import fetch from 'node-fetch';
import AWS from 'aws-sdk';
import Twig from 'twig';
AWS.config.update({ region: 'us-east-1' });
const sns = new AWS.SNS({ apiVersion: '2010-03-31' });
import { Format, Notification, timeout } from '../utilities';

// Service provider for Endpoint business logic
class EndpointProvider {
  constructor(endpoint, fields, lead_id, lead_version, route, channel, site_name, retryCount, responseId, config) {
    this.config = config;
    this.endpoint = endpoint;
    this.fields = fields;
    this.originalFields = JSON.parse(JSON.stringify(fields));
    this.leadInfo = {
      lead_id: lead_id,
      lead_version: lead_version,
      route: route,
      channel: channel,
      site_name: site_name,
      retryCount: retryCount,
      responseId: responseId,
    };
  }

  // Checks whether the endpoint has an official field map and returns a boolean
  hasOfficialFieldMap() {
    return !!this.endpoint.field_map;
  }

  // Process the fields using any field maps / filters
  processFields() {
    let fields = this.fields;

    // Map fields to field map
    // If we have an official field map, use it
    if (this.hasOfficialFieldMap()) {
      console.log('Official field map');
      fields = Format.mapFields(fields, this.endpoint.field_map, this.endpoint.strip_blanks, false);
    }
    // Otherwise, just strip any blank fields
    else {
      console.log('No field map');
      fields = Format.stripBlanks(fields);
    }

    this.fields = fields;

    return;
  }

  // Fire SNS events
  async publish(message, topic, stringify = true) {
    const params = {
      Message: stringify ? JSON.stringify(message) : message,
      TopicArn: topic,
    };
    // Send SNS topic
    return sns.publish(params).promise();
  }

  // Format the post data to use the form encoded format
  formatFormEncoded(fields) {
    let formData = '';
    let starting = true;

    for (const field in fields) {
      // Prepend & if this is not the first iteration
      if (starting) starting = false;
      else formData += '&';

      formData += `${field}=${fields[field]}`;
    }

    return formData;
  }

  // Fire method that handles http endpoints
  async fireHTTPEndpoint() {
    console.log('Sending HTTP request');
    let response = {};

    // Process the fields using field map / filters
    this.processFields();

    // We need to wrap request in try catch to account for timeout (still want to handleResponse for timeouts)
    try {
      // Replace any variables in the URL with our original fields
      const urlTemplate = Twig.twig({
        data: this.endpoint.url,
      });

      // Generate actual URL using twig
      const finalUrl = urlTemplate.render(this.originalFields);
      console.log('URL of request', finalUrl);

      // Format the fields based on the provided content type
      const postFields =
        this.endpoint.headers &&
        (this.endpoint.headers['Content-Type'] === 'application/x-www-form-urlencoded' ||
          this.endpoint.headers['content-type'] === 'application/x-www-form-urlencoded')
          ? this.formatFormEncoded(this.fields)
          : JSON.stringify(this.fields);

      // Create params for fetch method (to hit endpoint)
      const fetchParams = {
        method: this.endpoint.method,
        body: postFields,
        // Default the content type to application/json unless otherwise specified
        headers:
          this.endpoint.headers && (this.endpoint.headers['Content-Type'] || this.endpoint.headers['content-type'])
            ? {}
            : { 'Content-Type': 'application/json' },
      };
      if (this.endpoint.headers) fetchParams.headers = { ...fetchParams.headers, ...this.endpoint.headers };

      // Hit Endpoint URL with params
      const result = await timeout(fetch(finalUrl, fetchParams));

      console.log('HTTP response:', result);

      // Get mandatory values
      response.status = result.status;
      response.statusText = result.statusText;

      // Check whether JSON was returned
      const contentType = result.headers.get('Content-Type');
      if (contentType && contentType.indexOf('application/json') !== -1) {
        response.body = await result.json();

        // Make sure response is actually JSON, if not then just make it JSON
        if (typeof response.body !== 'object') {
          response.body = {
            message: response.body,
          };
        }
        console.log('Parsed response JSON', response.body);
      } else {
        response.body = { message: response.body || 'Endpoint did not return any json' };
      }
    } catch (err) {
      // Catch any issues with the request
      console.log(err);

      response = {
        status: 500,
        statusText: err.message,
        body: { message: 'Endpoint did not return any json' },
      };
    }

    // Handle response record
    return this.handleRequestResponse(response);
  }

  // Fire method that handles email endpoints
  async fireEmailEndpoint() {
    console.log('Sending email to', this.endpoint.recipient);

    // Set up the SNS configuration to send the notification
    await this.publish(
      {
        app: {
          name: this.config.app.name,
          logo: this.config.app.logo,
          emoji: this.config.slack.emoji,
        },
        email: await Notification.generateEmail(this.endpoint.recipient, this.leadInfo.route.name, this.fields, {
          subject: this.endpoint.subject,
          body: this.endpoint.body,
          cc: this.endpoint.cc,
          bcc: this.endpoint.bcc,
          reply_to: this.endpoint.reply_to,
        }),
      },
      this.config.sns.notification
    );

    const response = {
      status: 200,
      statusText: 'Sent email',
      body: { json: false },
    };

    // Handle response record
    return this.handleRequestResponse(response);
  }

  // Generic fire method that triggers specific fire method based on endpoint type
  fire() {
    switch (this.endpoint.type) {
      case 'email':
        return this.fireEmailEndpoint();
      case 'http':
        return this.fireHTTPEndpoint();
    }
  }

  // Wait a certain amount of time, before proceeding (returns a promise)
  wait(ms) {
    return new Promise((res) => setTimeout(res, ms));
  }

  // Handles whatever responses endpoints get back
  async handleRequestResponse(response) {
    // If the request succeeded, send the success notification
    if (response.status >= 200 && response.status < 300) {
      return this.publish(
        {
          record: response,
          channel: this.leadInfo.channel,
          route: this.leadInfo.route,
          site_name: this.leadInfo.site_name,
          lead_id: this.leadInfo.lead_id,
          lead_version: this.leadInfo.lead_version,
          endpoint_id: this.endpoint.id,
          responseId: this.leadInfo.responseId,
        },
        `${this.config.sns.mailroomPrefix}endpointSuccess`
      );
    }

    // If the request failed, see if we've tried to refire the endpoint yet
    // If we haven't tried to refire the endpoint yet, fire it again
    if (!this.leadInfo.retryCount) {
      console.log('Endpoint failed to fire, attempting refire.');

      // Wait 20 seconds before attempting a refire (prevent any race conditions and give bad servers a chance to recover)
      if (!process.env.testing) {
        console.log('Waiting 20 seconds before refiring.');
        await this.wait(20000);
        console.log('Refiring.');
      }

      // Refire endpoint
      return this.publish(
        {
          id: this.endpoint.id,
          fields: this.originalFields,
          lead_id: this.leadInfo.lead_id,
          lead_version: this.leadInfo.lead_version,
          lead_info: this.leadInfo.lead_version,
          route: this.leadInfo.route,
          channel: this.leadInfo.channel,
          site_name: this.leadInfo.site_name,
          retryCount: 1,
        },
        `${this.config.sns.mailroomPrefix}fireEndpoint`
      );
    }

    console.log('Endpoint failed to refire. Failure permanent.');

    // If we have already retried, send the failure notification
    return this.publish(
      {
        record: response,
        channel: this.leadInfo.channel,
        route: this.leadInfo.route,
        site_name: this.leadInfo.site_name,
        lead_id: this.leadInfo.lead_id,
        lead_version: this.leadInfo.lead_version,
        endpoint_id: this.endpoint.id,
        responseId: this.leadInfo.responseId,
      },
      `${this.config.sns.mailroomPrefix}endpointFailure`
    );
  }
}

export { EndpointProvider };
