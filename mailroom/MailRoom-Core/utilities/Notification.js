import emailBody from '../templates/newLead.html';
import emailRow from '../templates/newLeadRow.html';
import emailSection from '../templates/emailSection.html';
import { Format } from '.';
import Twig from 'twig';
import { getConfig } from '../config';

// Contains methods relating to notifications
const Notification = {
  // *** EMAIL ***

  // Generates the JSON required by the notification service (for email)
  generateEmail: async (recipient, route_name, fields, options, lead_id) => {
    // Get current time
    const date = Date.now();

    // Get config
    const config = await getConfig();
    // Create email JSON object
    const email = {
      // Email address where the message is being sent
      to: recipient,
      // CC
      cc: options && options.cc ? options.cc : undefined,
      // BCC
      bcc: options && options.bcc ? options.bcc : undefined,
      // Who the email is coming from (reply to email)
      reply_to: options && options.reply_to ? options.reply_to : config.mailgun.fromEmail,
      // The HTML body of the message
      message: Notification.generateEmailContents(date, route_name, fields, options, lead_id),
      // The subject of the message
      subject: Notification.generateSubject(fields, options),
      // If there are options, the email will be text only
      textOnly: !!(options && options.body),
    };
    return email;
  },

  // Generates body of email for notification endpoint
  generateEmailContents: (date, route_name, fields, options, lead_id) => {
    // If there are options, use the options body template
    if (options && options.body) {
      return Notification.generatePartnerEmailBody(fields, options);
    }
    // If the email is for internal teams, use the normal template
    return Notification.generateInternalEmailBody(date, route_name, fields, lead_id);
  },

  // Generate partner email body
  generatePartnerEmailBody: (fields, options) => {
    // Generate the partner email body using twig and the partner's template
    const template = Twig.twig({
      data: options.body,
    });

    return template.render(fields);
  },

  // Generate internal body
  generateInternalEmailBody: (date, route_name, fields, lead_id) => {
    // Blank content variable to be populated with templates
    let content = '';

    // Reformat date into JS date and extract relevant info
    const formattedDate = Format.formatDate(date);
    const formattedTime = Format.formatTime(date);

    // Use twig to generate sections
    const sectionTemplate = Twig.twig({
      data: emailSection,
    });

    // Use twig to generate rows
    const rowTemplate = Twig.twig({
      data: emailRow,
    });

    // Loop through the categories in our field object
    for (const category in fields) {
      // Blank rows variable to be populated with lead information
      let rows = '';

      // Loop through provided fields and generate rows
      for (const field in fields[category]) {
        const row = rowTemplate.render({
          key: Format.formatField(field),
          value: fields[category][field],
        });
        rows += row;
      }

      // Generate section using template
      const section = sectionTemplate.render({
        category: category,
        rows: rows,
      });

      // Store final content in email body
      content += section;
    }

    // Use twig to generate body of email
    const bodyTemplate = Twig.twig({
      data: emailBody,
    });

    return bodyTemplate.render({
      date: formattedDate,
      time: formattedTime,
      route_name: Format.formatField(route_name),
      // Using long PT luid string for now
      lead_id: Format.generateLongLeadID(lead_id),
      content: content,
    });
  },

  // Generate a dynamic subject line for the email
  generateSubject: (fields, options) => {
    // If the email is for partners, use their subject template from db (options provided when emailing partner)
    if (options && options.subject) return Notification.generatePartnerSubject(fields, options);
    // If the email is for internal notifications, generate a templated subject
    return Notification.generateInternalSubject(fields);
  },

  // Generate the partner subject
  generatePartnerSubject: (fields, options) => {
    // Generate subject using twig
    const template = Twig.twig({
      data: options.subject,
    });

    return template.render(fields);
  },

  // Generate the internal email subject
  generateInternalSubject: (fields) => {
    // Flatten our fields object (comes in with categories)
    fields = Format.flattenObject(fields);

    // Generate normal internal email subject
    return `${fields.full_name ? `${fields.full_name} - ` : ''}${
      fields.source ? (fields.requested_service ? `${fields.source} ${fields.requested_service} - ` : `${fields.source} - `) : ''
    }${fields.invoca_call_duration ? `${fields.invoca_call_duration} Second ` : ''}${fields.lead_attribution ? `${fields.lead_attribution} ` : ''}${
      fields.lead_type ? `${fields.lead_type} ` : ''
    }Lead`;
  },

  // *** SLACK ***

  // Generates the JSON required by the notification service (for slack)
  generateSlack: async (color, slack_channel, site, channel, route_name, errorMessage, leadDetails) => {
    // Get current time
    const date = Date.now();

    // Create JS date object for other functions
    const formattedDate = Format.formatDate(date);
    const formattedTime = Format.formatTime(date);

    // Create email JSON object
    const slack = {
      username: 'MailRoom',
      icon_emoji: ':postbox:',
      channel: `#${slack_channel}`,
      attachments: [
        {
          fallback: `New ${Format.formatField(channel)} Lead - ${Format.formatField(site)} - ${formattedDate} ${formattedTime}`,
          title: 'New Lead :incoming_envelope:',
          color: color,
          fields: [
            {
              title: 'Date',
              value: formattedDate,
              short: true,
            },
            {
              title: 'Time',
              value: formattedTime,
              short: true,
            },
          ],
        },
      ],
    };

    // If full name is provided, display it in the message
    if (leadDetails && leadDetails.full_name) {
      // Insert entry
      slack.attachments[0].fields.push({
        title: 'Full Name',
        value: leadDetails.full_name,
        short: true,
      });
    }

    // If phone is provided, display it in the message
    if (leadDetails && leadDetails.phone) {
      // Insert entry
      slack.attachments[0].fields.push({
        title: 'Phone Number',
        value: leadDetails.phone,
        short: true,
      });
    }

    // If call duration is provided, display it in the message
    if (leadDetails && leadDetails.invoca_call_duration) {
      // Insert entry
      slack.attachments[0].fields.push({
        title: 'Call Duration',
        value: Format.formatDuration(leadDetails.invoca_call_duration),
        short: true,
      });
    }

    // If lead attribution is provided, display it in the message
    if (leadDetails && leadDetails.lead_attribution) {
      // Insert entry
      slack.attachments[0].fields.push({
        title: 'Attribution',
        value: leadDetails.lead_attribution,
        short: true,
      });
    }

    // If site is provided, display it in the message
    if (site) {
      // Insert entry
      slack.attachments[0].fields.push({
        title: 'Site',
        value: Format.formatField(site),
        short: true,
      });
    }

    // If channel is provided, display it in the message
    if (channel) {
      // Insert entry
      slack.attachments[0].fields.push({
        title: 'Channel',
        value: Format.formatField(channel),
        short: true,
      });
    }

    // If lead id is provided, display it in the message
    if (leadDetails && leadDetails.lead_id) {
      // Get config
      const config = await getConfig();

      // Add link to title
      slack.attachments[0].title_link = `${config.mailRoomURL}/leads/${leadDetails.lead_id}${
        leadDetails.lead_version ? `/${leadDetails.lead_version}` : '/1'
      }`;
      // Insert entry
      slack.attachments[0].fields.push({
        title: 'Lead ID',
        // Using long PT luid string for now
        value: Format.generateLongLeadID(leadDetails.lead_id),
        short: true,
      });
    }

    // If woopra url is provided, display it in the message
    if (leadDetails && leadDetails.w_url) {
      // Insert entry
      slack.attachments[0].fields.push({
        title: 'Woopra Details',
        value: `<${leadDetails.w_url}|View Lead>`,
        short: true,
      });
    }

    // If the route name is provided, display it in the message
    if (route_name) {
      // Insert entry
      slack.attachments[0].fields.push({
        title: 'Route',
        value: route_name,
        short: true,
      });
    }

    // If an error message is provided, display it in the message
    if (errorMessage) {
      // Set title line to denote error
      slack.attachments[0].title = 'Error :x:';
      slack.attachments[0].fallback = `Error: ${errorMessage}\n\nRoute: ${route_name ? route_name : ''}`;
      // Insert entry
      slack.attachments[0].fields.push({
        title: 'Error',
        value: errorMessage,
        short: true,
      });
    }

    return slack;
  },
};

export { Notification };
