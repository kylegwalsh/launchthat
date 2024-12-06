// *** HANDLER ***

// Import the utilities functions for testing
import { Format, Notification } from '../utilities';
import { getConfig } from '../config';

// Store config
let config;
// Stores input for event
let input;

// *** MOCKS ***

// Disable console log
console.log = jest.fn();

// Mock aws-sdk function
jest.mock('aws-sdk', () => {
  return {
    // config function
    config: {
      update: () => {
        return;
      },
    },
    // SSM class
    SSM: class {
      getParameters() {
        return {
          promise: () => {
            // Return fake params
            return {
              Parameters: [
                {
                  Name: 'Applications-Database-Host',
                  Value: 'host',
                },
                {
                  Name: 'Applications-Database-User',
                  Value: 'user',
                },
                {
                  Name: 'MailRoom-Database-Password',
                  Value: 'pass',
                },
                {
                  Name: 'MailRoom-MailGun-Key',
                  Value: 'key',
                },
                {
                  Name: 'Slack-Webhook',
                  Value: 'url',
                },
              ],
            };
          },
        };
      }
    },
  };
});

// Mock the date function so it returns the specified testing value
Date.now = jest.fn(() => {
  return '2018-08-23T20:55:51+00:00';
});

// *** DEFAULTS ***

// Default input for email notification utility
const defaultEmailInput = {
  lead_email: 'kwalsh@launchthat.com',
  route_name: 'test',
  lead_id: 73,
  fields: {
    'Contact Information': {
      full_name: '213-955-1200',
      phone: '213-955-1200',
    },
    'Lead Data': {
      luid: 'PT0000000000000073',
      vertical: 'Asbestos',
      source: 'Asbestos.com',
      lead_type: 'Phone',
      lead_attribution: 'Paid',
    },
    'Other Details': {
      invoca_hook_type: 'post',
      invoca_call_duration: 50,
    },
  },
};

// *** TESTS ***

// Test for format utility
describe('Utilities - Format Tests', () => {
  // Initialize config
  beforeAll(async () => {
    process.env.stage = 'dev';
    config = await getConfig();
  });

  // *** TEST 1 ***
  test('Format Date', () => {
    // Input for utility
    const input = new Date('2018-08-23T20:55:51+00:00');

    // Expected result to test against
    const expectedResult = 'Aug 23, 2018';

    // Run function to format input
    const result = Format.formatDate(input);

    // Verify that the result is correct
    expect(result).toBe(expectedResult);
  });

  // *** TEST 2 ***
  test('Format Time', () => {
    // Input for utility (12:00 AM)
    let input = new Date('2018-08-23T04:00:00+00:00');

    // Expected result to test against
    let expectedResult = '12:00 AM';

    // Run function
    let result = Format.formatTime(input);

    // Verify that the result is correct
    expect(result).toBe(expectedResult);

    // Input for utility (12:00 PM)
    input = new Date('2018-08-23T16:00:00+00:00');

    // Expected result to test against
    expectedResult = '12:00 PM';

    // Run function to format input
    result = Format.formatTime(input);

    // Verify that the result is correct
    expect(result).toBe(expectedResult);

    // Input for utility (7:00 AM)
    input = new Date('2018-08-23T11:00:00+00:00');

    // Expected result to test against
    expectedResult = '7:00 AM';

    // Run function to format input
    result = Format.formatTime(input);

    // Verify that the result is correct
    expect(result).toBe(expectedResult);
  });

  // *** TEST 3 ***
  test('Format Field', () => {
    // Input for utility
    let input = 'little text';

    // Expected result to test against
    let expectedResult = 'Little Text';

    // Run function
    let result = Format.formatField(input);

    // Verify that the result is correct
    expect(result).toBe(expectedResult);

    // Input for utility (7:00 AM)
    input = 'underscore_text';

    // Expected result to test against
    expectedResult = 'Underscore Text';

    // Run function to format input
    result = Format.formatField(input);

    // Verify that the result is correct
    expect(result).toBe(expectedResult);
  });

  // *** TEST 4 ***
  test('Format Duration', () => {
    // Input for utility
    const input = 610;

    // Expected result to test against
    const expectedResult = '10 Minutes, 10 Seconds';

    // Run function
    const result = Format.formatDuration(input);

    // Verify that the result is correct
    expect(result).toEqual(expectedResult);
  });

  // *** TEST 5 ***
  test('Flatten Object', () => {
    // Input for utility
    const input = {
      contact_information: {
        first_name: 'Kyle',
        last_name: 'Walsh',
        phone_number: '1234567890',
      },
      lead_data: {
        luid: 'PT000000000000012',
      },
      ungrouped: {
        test_id: '1',
      },
    };

    // Expected result to test against
    const expectedResult = {
      first_name: 'Kyle',
      last_name: 'Walsh',
      phone_number: '1234567890',
      luid: 'PT000000000000012',
      test_id: '1',
    };

    // Run function
    const result = Format.flattenObject(input);

    // Verify that the result is correct
    expect(result).toEqual(expectedResult);
  });

  // *** TEST 6 ***
  test('Map Fields - No Strip', () => {
    // Input for utility
    const input = {
      last_name: 'Johnson',
      phone: '407-123-4567',
      luid: 12,
      vertical: 1,
      source: 'google',
      lead_type: '',
      lead_attribution: 'Paid',
    };

    // Field map used to map input
    const fieldMap = [
      {
        'Contact Information': [
          {
            target: 'last_name',
            output: 'last',
          },
          {
            target: 'phone',
            output: 'phone_number',
          },
        ],
      },
      {
        'Lead Data': [
          {
            target: 'luid',
            output: 'luid',
          },
          {
            target: 'vertical',
            output: 'vertical',
          },
          {
            target: 'source',
            output: 'source',
          },
          {
            target: 'lead_type',
            output: 'lead_type',
          },
          {
            target: 'lead_attribution',
            output: 'lead_attribution',
          },
        ],
      },
    ];

    // Expected result to test against
    const expectedResult = {
      'Contact Information': {
        last: 'Johnson',
        phone_number: '407-123-4567',
      },
      'Lead Data': {
        luid: 12,
        vertical: 1,
        source: 'google',
        lead_type: '',
        lead_attribution: 'Paid',
      },
    };

    // Run function
    const result = Format.mapFields(input, fieldMap, false, true);

    // Verify that the result is correct
    expect(result).toEqual(expectedResult);
  });

  // *** TEST 7 ***
  test('Map Fields - Strip', () => {
    // Input for utility
    const input = {
      last_name: 'Johnson',
      phone: '407-123-4567',
      luid: '',
      vertical: 1,
      source: 'google',
      lead_type: 'web',
      lead_attribution: 'Paid',
    };

    // Field map used to map input
    const fieldMap = [
      {
        contact_information: [
          {
            target: 'last_name',
            output: 'last',
          },
          {
            target: 'phone',
            output: 'phone_number',
          },
        ],
      },
      {
        lead_data: [
          {
            target: 'luid',
            output: 'luid',
          },
        ],
      },
    ];

    // Expected result to test against
    const expectedResult = {
      contact_information: {
        last: 'Johnson',
        phone_number: '407-123-4567',
      },
    };

    // Run function
    const result = Format.mapFields(input, fieldMap, true, true);

    // Verify that the result is correct
    expect(result).toEqual(expectedResult);
  });

  // *** TEST 8 ***
  test('Strip Blanks', () => {
    // Input for utility
    const input = {
      non_blank: 'yay',
      blank: '',
    };

    // Run function
    const result = Format.stripBlanks(input);

    // Input for utility
    const expectedResult = {
      non_blank: 'yay',
    };

    // Verify that the result is correct
    expect(result).toEqual(expectedResult);
  });

  // *** TEST 9 ***
  test('Is Empty', () => {
    // Input for utility
    let input = {};

    // Run function
    const result = Format.isEmpty(input);

    // Input for utility
    input = {
      test: 1,
    };

    // Run function
    const result2 = Format.isEmpty(input);

    // Verify that the result is correct
    expect(result).toEqual(true);
    expect(result2).toEqual(false);
  });

  // *** TEST 10 ***
  test('Generate Long Lead ID', () => {
    // Input for utility
    const input = 50932;

    // Run function
    const result = Format.generateLongLeadID(input);

    // Verify that the result is correct
    expect(result).toEqual('PT0000000000050932');
  });
});

// Test for notification utility
describe('Utilities - Notification Tests', () => {
  beforeEach(() => {
    // Get default input
    input = JSON.parse(JSON.stringify(defaultEmailInput));
  });

  // *** TEST 1 ***
  test('Generate Email (Options)', async () => {
    // Override default input
    input.options = {
      cc: 'test@launchthat.com',
      bcc: 'test2@launchthat.com',
      reply_to: 'no-reply@test.com',
    };

    // Run function to generate email
    const email = await Notification.generateEmail(input.lead_email, input.route_name, input.fields, input.options);

    // Verify to is correct
    expect(email.to).toBe('kwalsh@launchthat.com');
    // Verify cc is correct
    expect(email.cc).toBe('test@launchthat.com');
    // Verify bcc is correct
    expect(email.bcc).toBe('test2@launchthat.com');
    // Verify reply_to is correct
    expect(email.reply_to).toBe('no-reply@test.com');
  });

  // *** TEST 2 ***
  test('Generate Email - No Options', async () => {
    // Run function to generate email
    const email = await Notification.generateEmail(input.lead_email, input.route_name, input.fields, input.options);

    // Verify to is correct
    expect(email.to).toBe('kwalsh@launchthat.com');
    // Verify cc is correct
    expect(email.cc).toBeUndefined();
    // Verify bcc is correct
    expect(email.bcc).toBeUndefined();
    // Verify reply_to is correct
    expect(email.reply_to).toBe('no-reply@launchthat.com');
  });

  // *** TEST 3 ***
  test('Generate Internal Email - Post-Hook Call', async () => {
    // Run function to generate email
    const email = await Notification.generateEmail(input.lead_email, input.route_name, input.fields, input.options, input.lead_id);

    // Verify to is correct
    expect(email.to).toBe('kwalsh@launchthat.com');

    // Verify subject is correct
    expect(email.subject).toBe('213-955-1200 - Asbestos.com - 50 Second Paid Phone Lead');

    // Verify textOnly is false (not using custom template)
    expect(email.textOnly).toBe(false);

    // Verify email message is correct (this will break if templates are changed)
    expect(email.message).toBe(
      '<p><strong>Lead Information:</strong></p>\r\n<ul>\r\n  <li>\r\n    Date: <strong>Aug 23, 2018</strong>\r\n  </li>\r\n  <li>\r\n    Time: <strong>4:55 PM</strong>\r\n  </li>\r\n  <li>\r\n    Route: <strong>Test</strong>\r\n  </li>\r\n  <li>\r\n    Lead ID: <strong>PT0000000000000073</strong>\r\n  </li>\r\n</ul>\r\n\r\n<p>\r\n  <strong>Contact Information:</strong>\r\n</p>\r\n<ul>\r\n  <li>\r\n  Full Name: <strong>213-955-1200</strong>\r\n</li>\r\n<li>\r\n  Phone: <strong>213-955-1200</strong>\r\n</li>\r\n\r\n</ul>\r\n<p>\r\n  <strong>Lead Data:</strong>\r\n</p>\r\n<ul>\r\n  <li>\r\n  Luid: <strong>PT0000000000000073</strong>\r\n</li>\r\n<li>\r\n  Vertical: <strong>Asbestos</strong>\r\n</li>\r\n<li>\r\n  Source: <strong>Asbestos.com</strong>\r\n</li>\r\n<li>\r\n  Lead Type: <strong>Phone</strong>\r\n</li>\r\n<li>\r\n  Lead Attribution: <strong>Paid</strong>\r\n</li>\r\n\r\n</ul>\r\n<p>\r\n  <strong>Other Details:</strong>\r\n</p>\r\n<ul>\r\n  <li>\r\n  Invoca Hook Type: <strong>post</strong>\r\n</li>\r\n<li>\r\n  Invoca Call Duration: <strong>50</strong>\r\n</li>\r\n\r\n</ul>\r\n\r\n'
    );
  });

  // *** TEST 4 ***
  test('Generate Internal Email - Web', async () => {
    // Override default input
    input.fields['Contact Information'] = {
      full_name: 'Kyle Walsh',
      first_name: 'Kyle',
      last_name: 'Walsh',
      phone: '213-955-1200',
    };
    input.fields['Lead Data'].lead_type = 'Web';
    input.fields['Other Details'] = {
      requested_service: 'Lawyer',
    };

    // Run function to generate email
    const email = await Notification.generateEmail(input.lead_email, input.route_name, input.fields, input.options, input.lead_id);

    // Verify to is correct
    expect(email.to).toBe('kwalsh@launchthat.com');

    // Verify subject is correct
    expect(email.subject).toBe('Kyle Walsh - Asbestos.com Lawyer - Paid Web Lead');

    // Verify textOnly is false (not using custom template)
    expect(email.textOnly).toBe(false);

    // Verify email message is correct (this will break if templates are changed)
    expect(email.message).toBe(
      '<p><strong>Lead Information:</strong></p>\r\n<ul>\r\n  <li>\r\n    Date: <strong>Aug 23, 2018</strong>\r\n  </li>\r\n  <li>\r\n    Time: <strong>4:55 PM</strong>\r\n  </li>\r\n  <li>\r\n    Route: <strong>Test</strong>\r\n  </li>\r\n  <li>\r\n    Lead ID: <strong>PT0000000000000073</strong>\r\n  </li>\r\n</ul>\r\n\r\n<p>\r\n  <strong>Contact Information:</strong>\r\n</p>\r\n<ul>\r\n  <li>\r\n  Full Name: <strong>Kyle Walsh</strong>\r\n</li>\r\n<li>\r\n  First Name: <strong>Kyle</strong>\r\n</li>\r\n<li>\r\n  Last Name: <strong>Walsh</strong>\r\n</li>\r\n<li>\r\n  Phone: <strong>213-955-1200</strong>\r\n</li>\r\n\r\n</ul>\r\n<p>\r\n  <strong>Lead Data:</strong>\r\n</p>\r\n<ul>\r\n  <li>\r\n  Luid: <strong>PT0000000000000073</strong>\r\n</li>\r\n<li>\r\n  Vertical: <strong>Asbestos</strong>\r\n</li>\r\n<li>\r\n  Source: <strong>Asbestos.com</strong>\r\n</li>\r\n<li>\r\n  Lead Type: <strong>Web</strong>\r\n</li>\r\n<li>\r\n  Lead Attribution: <strong>Paid</strong>\r\n</li>\r\n\r\n</ul>\r\n<p>\r\n  <strong>Other Details:</strong>\r\n</p>\r\n<ul>\r\n  <li>\r\n  Requested Service: <strong>Lawyer</strong>\r\n</li>\r\n\r\n</ul>\r\n\r\n'
    );
  });

  // *** TEST 5 ***
  test('Generate Partner Email', async () => {
    // Override default input
    input.fields = {
      full_name: 'Kyle Walsh',
      first_name: 'Kyle',
      last_name: 'Walsh',
      phone: '213-955-1200',
      vertical: 'Asbestos',
      source: 'Asbestos.com',
      lead_type: 'Web',
      luid: 'PT0000000000000073',
      lead_attribution: 'Paid',
      requested_service: 'Lawyer',
      utm_source: 'google',
    };
    input.options = {
      subject: 'Special Partner Subject - {{full_name}} {% if utm_source == "google" %}Google{% endif %}',
      body:
        'B: Begin\n/// Contact Data ///\nFirst Name: {{first_name}}\nLast Name: {{last_name}}\nPhone: {{phone}}\n--------------------------------------------------------------------\n/// Lead Data ///\nLead ID: {{luid}}\nLead Created Date: {{lead_processed_date}}\nIntake Source: Wilson & Peterson, LLP {{cause}} SHC{% if lead_type == "Phone" %} Call{% endif %}',
    };

    // Run function to generate email
    const email = await Notification.generateEmail(input.lead_email, input.route_name, input.fields, input.options);

    // Verify to is correct
    expect(email.to).toBe('kwalsh@launchthat.com');

    // Verify subject is correct
    expect(email.subject).toBe('Special Partner Subject - Kyle Walsh Google');

    // Verify textOnly is true (using custom template)
    expect(email.textOnly).toBe(true);

    // Verify email message is correct
    expect(email.message).toBe(
      'B: Begin\n/// Contact Data ///\nFirst Name: Kyle\nLast Name: Walsh\nPhone: 213-955-1200\n--------------------------------------------------------------------\n/// Lead Data ///\nLead ID: PT0000000000000073\nLead Created Date: \nIntake Source: Wilson & Peterson, LLP  SHC'
    );
  });

  // *** TEST 6 ***
  test('Generate Slack - Success', async () => {
    // Override default input
    input = {
      color: 'good',
      slack_channel: 'mars-testing',
      site_name: 'Asbestos.com',
      channel: 'call',
      route_name: 'test',
      leadDetails: {
        full_name: 'Kyle Walsh',
        phone: '407-123-4567',
        lead_attribution: 'Paid',
        lead_id: 12,
        lead_version: 1,
        invoca_call_duration: 610,
        w_url: 'https://app.woopra.com/project/asbestoslungcancer.org/people/people:default/profile/Hhbv170e6dFc',
      },
    };

    // Final resulting fields that should be generated
    const finalFields = [
      {
        title: 'Date',
        value: 'Aug 23, 2018',
        short: true,
      },
      {
        title: 'Time',
        value: '4:55 PM',
        short: true,
      },
      {
        title: 'Full Name',
        value: 'Kyle Walsh',
        short: true,
      },
      {
        title: 'Phone Number',
        value: '407-123-4567',
        short: true,
      },
      {
        title: 'Call Duration',
        value: '10 Minutes, 10 Seconds',
        short: true,
      },
      {
        title: 'Attribution',
        value: 'Paid',
        short: true,
      },
      {
        title: 'Site',
        value: 'Asbestos.com',
        short: true,
      },
      {
        title: 'Channel',
        value: 'Call',
        short: true,
      },
      {
        title: 'Lead ID',
        value: 'PT0000000000000012',
        short: true,
      },
      {
        title: 'Woopra Details',
        value: '<https://app.woopra.com/project/asbestoslungcancer.org/people/people:default/profile/Hhbv170e6dFc|View Lead>',
        short: true,
      },
      {
        title: 'Route',
        value: 'test',
        short: true,
      },
    ];

    const slack = await Notification.generateSlack(
      input.color,
      input.slack_channel,
      input.site_name,
      input.channel,
      input.route_name,
      input.errorMessage,
      input.leadDetails
    );

    // Verify slack channel is correct
    expect(slack.channel).toBe('#mars-testing');

    // Verify title is correct (no error)
    expect(slack.attachments[0].title).toEqual('New Lead :incoming_envelope:');

    // Verify title is correct (no error)
    expect(slack.attachments[0].title_link).toEqual(`${config.mailRoomURL}/leads/${input.leadDetails.lead_id}/${input.leadDetails.lead_version}`);

    // Verify attachment fields are correct
    expect(slack.attachments[0].fields).toEqual(finalFields);
  });

  // *** TEST 7 ***
  test('Generate Slack - Error', async () => {
    // Override default input
    const input = {
      color: 'good',
      slack_channel: 'mars-testing',
      errorMessage: 'Failed to post',
      route_name: 'test',
      leadDetails: {
        lead_id: 12,
        lead_version: 1,
      },
    };

    // Final resulting fields that should be generated
    const finalFields = [
      {
        title: 'Date',
        value: 'Aug 23, 2018',
        short: true,
      },
      {
        title: 'Time',
        value: '4:55 PM',
        short: true,
      },
      {
        title: 'Lead ID',
        value: 'PT0000000000000012',
        short: true,
      },
      {
        title: 'Route',
        value: 'test',
        short: true,
      },
      {
        title: 'Error',
        value: 'Failed to post',
        short: true,
      },
    ];

    const slack = await Notification.generateSlack(
      input.color,
      input.slack_channel,
      input.site_name,
      input.channel,
      input.route_name,
      input.errorMessage,
      input.leadDetails
    );

    // Verify slack channel is correct
    expect(slack.channel).toBe('#mars-testing');

    // Verify title is correct (no error)
    expect(slack.attachments[0].title).toEqual('Error :x:');

    // Verify title is correct (no error)
    expect(slack.attachments[0].title_link).toEqual(`${config.mailRoomURL}/leads/${input.leadDetails.lead_id}/${input.leadDetails.lead_version}`);

    // Verify attachment fields are correct
    expect(slack.attachments[0].fields).toEqual(finalFields);
  });
});
