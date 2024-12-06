// *** HANDLER ***

// Import the controller handler for testing
import { handler } from '../functions/controller';
import { getConfig } from '../config';

// Store config
let config;
// Stores input for event
let input;

// *** MOCKS ***

// Disable console log
console.log = jest.fn();

// Store mocked requests for testing
let mockRequests = [];

// Store mocked results from DB
let mockData = [];

// Mock aws-sdk function
jest.mock('aws-sdk', () => {
  return {
    // config function
    config: {
      update: () => {
        return;
      },
    },
    // SNS class
    SNS: class {
      publish(params) {
        return {
          promise: () => {
            // Mock an unexpected error
            if (JSON.parse(params.Message).id === -1) {
              throw new Error('This is fine...');
            } else {
              // Store request in our requests array
              mockRequests.push(params);
            }
          },
        };
      }
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

// Mock db functions
jest.mock('../database/db', () => {
  return {
    // db variable
    db: {
      // connect method
      connect: () => {
        // query methods
        return {
          execute: () => {
            // Remove item from data array
            return mockData.shift();
          },
          end: () => {
            return;
          },
        };
      },
    },
  };
});

// *** DEFAULTS ***

// Default input for handler
const defaultInput = {
  lead_id: 73,
  shuttle_id: null,
  vertical_id: 1,
  site_id: 1,
  fields: {
    test_field: 'testing \r\n did it work?',
    shuttle_key: 'c30856a6-11f9-470c-b3f6-79a0ea2d0cb0',
    invoca_hook_type: 'pre',
    last_name: '213-955-1200',
    phone: '213-955-1200',
    city: 'Los Angeles',
    state: 'CA',
    invoca_call_id: 'C5898D42-C452BB82',
    invoca_call_start_time: '2018-10-26T01:26:35+00:00',
    invoca_call_keypresses: '',
    ip_address: '',
    heirial2: '',
    heirial2_uid: '',
    telescope_id: '',
    vertical: 'Asbestos',
    source: 'Asbestos.com',
    lead_type: 'Phone',
    sf_record_type: '01215000001YjJU',
    invoca_campaign_name: 'Asbestos.com Google AdWords Search',
    invoca_promo_number: '877-591-1140',
    invoca_promo_description: 'utm_c=meso-doctors',
    invoca_destination_number: '321-430-2214',
    invoca_advertiser_id: '233988',
    referrer: '',
    search_engine: '',
    search_query: '',
    mkwid: '',
    gclid: '',
    utm_source: 'google',
    utm_campaign: '',
    utm_medium: 'cpc',
    utm_content: 'brian-pettiford',
    utm_term: '',
    ruid: 'patient_advocates',
    campaign_id: 'Asbestos.com Google AdWords Search',
    is_paid: '1',
    lead_attribution: 'Paid',
    adwords_device: 'Mobile',
    luid: 'PT0000000000000073',
    lead_processed_date: '2018-08-23T20:55:51+00:00',
    effect: 'N/A',
    requested_service: 'Free Quote',
    w_url: 'https://app.woopra.com/project/asbestoslungcancer.org/people/people:default/profile/Hhbv170e6dFc',
  },
  route_id: 2,
  channel: 'call',
};

// Default mockDB data
const defaultData = [
  // First DB query (endpoint activeness)
  [[{ id: 0, active: 1 }, { id: 1, active: 1 }, { id: 2, active: 0 }]],
  // Second DB query (vertical details)
  [
    [
      {
        name: 'Test',
        lead_email: 'kwalsh@launchthat.com',
        lead_slack: 'mars-official',
        lead_email_test: 'kwalsh@test.com',
        lead_slack_test: 'mars-testing',
      },
    ],
  ],
  // Third DB query (site details)
  [
    [
      {
        active: true,
        name: 'Test.com',
      },
    ],
  ],
  // Fourth DB query (route name)
  [
    [
      {
        name: 'test-route',
      },
    ],
  ],
  // Fifth DB query (field map for internal emails)
  [
    [
      {
        field_map: [
          {
            contact_information: [
              { output: 'full_name', target: 'full_name' },
              { output: 'phone', target: 'phone' },
              { output: 'email', target: 'email' },
              { output: 'comments', target: 'comments' },
              { output: 'cause', target: 'cause' },
              { output: 'effect', target: 'effect' },
              { output: 'vaccine_year', target: 'vaccine_year' },
              { output: 'vaccine_type', target: 'vaccine_type' },
              { output: 'requested_service', target: 'requested_service' },
            ],
          },
          {
            user_data: [
              { output: 'w_url', target: 'w_url' },
              { output: 'chat_transcript', target: 'chat_transcript' },
              { output: 'invoca_call_duration', target: 'invoca_call_duration' },
              { output: 'invoca_campaign_name', target: 'invoca_campaign_name' },
              { output: 'invoca_promo_description', target: 'invoca_promo_description' },
            ],
          },
          {
            attribution_data: [
              { output: 'lead_attribution', target: 'lead_attribution' },
              { output: 'utm_source', target: 'utm_source' },
              { output: 'utm_campaign', target: 'utm_campaign' },
              { output: 'utm_medium', target: 'utm_medium' },
              { output: 'utm_content', target: 'utm_content' },
              { output: 'utm_term', target: 'utm_term' },
              { output: 'fb_campaign_name', target: 'fb_campaign_name' },
              { output: 'fb_adset_name', target: 'fb_adset_name' },
            ],
          },
        ],
      },
    ],
  ],
  // Sixth DB query (get count of leads "version")
  [
    [
      {
        version: null,
      },
    ],
  ],
  // Seventh DB query (insert lead)
  [],
];

// *** TESTS ***

// Test for controller
describe('Controller Tests', () => {
  // Initialize config
  beforeAll(async () => {
    process.env.stage = 'dev';
    config = await getConfig();
  });

  // Run before each test
  beforeEach(() => {
    // Empty requests array
    mockRequests = [];
    // Get default db query data
    mockData = JSON.parse(JSON.stringify(defaultData));
    // Get default input
    input = JSON.parse(JSON.stringify(defaultInput));
  });

  // *** TEST 1 ***
  test('Site Enabled, Endpoints Enabled - Non-Test', async () => {
    // Mock event received by handler
    const event = {
      Records: [
        {
          Sns: {
            Message: JSON.stringify(input),
          },
        },
      ],
    };

    // Run controller with mocked event
    const result = await handler(event);

    // Verify that function returned successfully
    expect(result.statusCode).toBe(200);

    // Verify there are 4 requests (2 notifications and 2 endpoints)
    expect(mockRequests.length).toBe(4);

    // First message was slack
    expect(JSON.parse(mockRequests[0].Message).slack).not.toBeUndefined();
    expect(JSON.parse(mockRequests[0].Message).slack.attachments[0].title_link).toBe(`${config.mailRoomURL}/leads/73/1`);
    // Second message was email and slack
    expect(JSON.parse(mockRequests[1].Message).email).not.toBeUndefined();
    expect(JSON.parse(mockRequests[1].Message).email.to).toBe('kwalsh@launchthat.com');
    expect(JSON.parse(mockRequests[1].Message).slack).not.toBeUndefined();
    expect(JSON.parse(mockRequests[1].Message).slack.channel).toBe('#mars-official');
    expect(JSON.parse(mockRequests[1].Message).slack.attachments[0].title_link).toBe(`${config.mailRoomURL}/leads/73/1`);
    // Third message was endpoint
    expect(JSON.parse(mockRequests[2].Message).fields).not.toBeUndefined();
    // Fourth message was endpoint
    expect(JSON.parse(mockRequests[3].Message).fields).not.toBeUndefined();
  });

  // *** TEST 1 ***
  test('Site Enabled, Endpoints Enabled - Test', async () => {
    // Override default input (set test route)
    input.route_id = 1;

    // Mock event received by handler
    const event = {
      Records: [
        {
          Sns: {
            Message: JSON.stringify(input),
          },
        },
      ],
    };

    // Run controller with mocked event
    const result = await handler(event);

    // Verify that function returned successfully
    expect(result.statusCode).toBe(200);

    // Verify there are 4 requests (2 notifications and 2 endpoints)
    expect(mockRequests.length).toBe(4);

    // First message was slack
    expect(JSON.parse(mockRequests[0].Message).slack).not.toBeUndefined();
    expect(JSON.parse(mockRequests[0].Message).slack.attachments[0].title_link).toBe(`${config.mailRoomURL}/leads/73/1`);
    // Second message was email and slack
    expect(JSON.parse(mockRequests[1].Message).email).not.toBeUndefined();
    expect(JSON.parse(mockRequests[1].Message).email.to).toBe('kwalsh@test.com');
    expect(JSON.parse(mockRequests[1].Message).slack).not.toBeUndefined();
    expect(JSON.parse(mockRequests[1].Message).slack.channel).toBe('#mars-testing');
    expect(JSON.parse(mockRequests[1].Message).slack.attachments[0].title_link).toBe(`${config.mailRoomURL}/leads/73/1`);
    // Third message was endpoint
    expect(JSON.parse(mockRequests[2].Message).fields).not.toBeUndefined();
    // Fourth message was endpoint
    expect(JSON.parse(mockRequests[3].Message).fields).not.toBeUndefined();
  });

  // *** TEST 3 ***
  test('Site Enabled, Endpoints Disabled', async () => {
    // Disable endpoints
    mockData[0][0] = [{ id: 0, active: 0 }, { id: 1, active: 0 }, { id: 2, active: 0 }];

    // Mock event received by handler
    const event = {
      Records: [
        {
          Sns: {
            Message: JSON.stringify(input),
          },
        },
      ],
    };

    // Run controller with mocked event
    const result = await handler(event);

    // Verify that function returned successfully
    expect(result.statusCode).toBe(200);

    // Verify there are 2 requests (2 notifications)
    expect(mockRequests.length).toBe(2);

    // First message was slack
    expect(JSON.parse(mockRequests[0].Message).slack).not.toBeUndefined();
    expect(JSON.parse(mockRequests[0].Message).slack.attachments[0].title_link).toBe(`${config.mailRoomURL}/leads/73/1`);
    // Second message was email and slack
    expect(JSON.parse(mockRequests[1].Message).email).not.toBeUndefined();
    expect(JSON.parse(mockRequests[1].Message).email.to).toBe('kwalsh@launchthat.com');
    expect(JSON.parse(mockRequests[1].Message).slack).not.toBeUndefined();
    expect(JSON.parse(mockRequests[1].Message).slack.channel).toBe('#mars-official');
    expect(JSON.parse(mockRequests[1].Message).slack.attachments[0].title_link).toBe(`${config.mailRoomURL}/leads/73/1`);
  });

  // *** TEST 4 ***
  test('No Vertical Notification for Updated Leads (New Version)', async () => {
    // Disable endpoints
    mockData[0][0] = [{ id: 0, active: 0 }, { id: 1, active: 0 }, { id: 2, active: 0 }];

    // Add a previous version to DB
    mockData[5][0][0].version = 1;

    // Mock event received by handler
    const event = {
      Records: [
        {
          Sns: {
            Message: JSON.stringify(input),
          },
        },
      ],
    };

    // Run controller with mocked event
    const result = await handler(event);

    console.log(mockRequests);

    // Verify that function returned successfully
    expect(result.statusCode).toBe(200);

    // Verify there are 1 requests (Lead info channel)
    expect(mockRequests.length).toBe(1);

    // First message was slack
    expect(JSON.parse(mockRequests[0].Message).slack).not.toBeUndefined();
    expect(JSON.parse(mockRequests[0].Message).slack.attachments[0].title_link).toBe(`${config.mailRoomURL}/leads/73/2`);
  });

  // *** TEST 5 ***
  test('Site Disabled, Endpoints Enabled', async () => {
    // Disable site
    mockData[2][0][0].active = false;

    // Mock event received by handler
    const event = {
      Records: [
        {
          Sns: {
            Message: JSON.stringify(input),
          },
        },
      ],
    };

    // Run controller with mocked event
    const result = await handler(event);

    // Verify that function returned successfully
    expect(result.statusCode).toBe(200);

    // Verify there are 1 request (1 notifications)
    expect(mockRequests.length).toBe(1);

    // Only message was slack
    expect(JSON.parse(mockRequests[0].Message).slack).not.toBeUndefined();
    expect(JSON.parse(mockRequests[0].Message).slack.attachments[0].title_link).toBe(`${config.mailRoomURL}/leads/73/1`);
  });

  // *** TEST 6 ***
  test('No Field Map', async () => {
    // Remove field map
    mockData[4][0] = undefined;

    // Mock event received by handler
    const event = {
      Records: [
        {
          Sns: {
            Message: JSON.stringify(input),
          },
        },
      ],
    };

    // Run controller with mocked event
    const result = await handler(event);

    // Verify that function returned successfully
    expect(result.statusCode).toBe(200);

    // Verify there are 5 requests (3 notifications and 2 endpoints)
    expect(mockRequests.length).toBe(5);
    // First message is warning about field map
    expect(JSON.parse(mockRequests[0].Message).slack).not.toBeUndefined();
    expect(JSON.parse(mockRequests[0].Message).slack.channel).toBe(`#${config.slack.errorChannel}`);
  });

  // *** TEST 7 ***
  test('Unexpected Error', async () => {
    // Create bad endpoint (trigger mocked error)
    mockData[0][0] = [{ id: -1, active: 1 }, { id: 1, active: 1 }, { id: 2, active: 1 }];

    // Mock event received by handler
    const event = {
      Records: [
        {
          Sns: {
            Message: JSON.stringify(input),
          },
        },
      ],
    };

    // Run controller with mocked event
    const result = await handler(event);

    // Verify that function failed
    expect(result.statusCode).toBe(500);

    // Verify there are 3 requests (3 notifications)
    expect(mockRequests.length).toBe(3);

    // First message was slack
    expect(JSON.parse(mockRequests[0].Message).slack).not.toBeUndefined();
    expect(JSON.parse(mockRequests[0].Message).slack.attachments[0].title_link).toBe(`${config.mailRoomURL}/leads/73/1`);
    // Second message was email and slack
    expect(JSON.parse(mockRequests[1].Message).email).not.toBeUndefined();
    expect(JSON.parse(mockRequests[1].Message).email.to).toBe('kwalsh@launchthat.com');
    expect(JSON.parse(mockRequests[1].Message).slack).not.toBeUndefined();
    expect(JSON.parse(mockRequests[1].Message).slack.channel).toBe('#mars-official');
    expect(JSON.parse(mockRequests[1].Message).slack.attachments[0].title_link).toBe(`${config.mailRoomURL}/leads/73/1`);
    // Third message was error
    expect(JSON.parse(mockRequests[2].Message).slack).not.toBeUndefined();
    expect(JSON.parse(mockRequests[2].Message).slack.channel).toBe(`#${config.slack.errorChannel}`);
  });
});

// String that can be fired into SNS:mailroom-core-dev-newLead as "raw"
// Call - {"lead_id":1,"site_id":1,"vertical_id":1,"route_id":1,"channel":"call","rule_version":2,"fields":{"w_url":"https://app.woopra.com/project/asbestoslungcancer.org/people/people:default/profile/Hhbv170e6dFc","test_field":"testing \r\n did it \"work\"? I'm not sure","shuttle_key":"c30856a6-11f9-470c-b3f6-79a0ea2d0cb0","invoca_hook_type":"post","full_name":"Beau Test","first_name":"Beau","last_name":"Test","phone":"213-955-1200","city":"Los Angeles","state":"CA","invoca_call_id":"C5898D42-C452BB82","invoca_call_start_time":"2018-10-26T01:26:35+00:00","invoca_call_keypresses":"","ip_address":"","heirial2":"","heirial2_uid":"","telescope_id":"","vertical":"Test","source":"Test","lead_type":"Phone","sf_record_type":"01215000001YjJU","invoca_campaign_name":"Asbestos.com Google AdWords Search","invoca_promo_number":"877-591-1140","invoca_promo_description":"utm_c=meso-doctors","invoca_destination_number":"321-430-2214","invoca_advertiser_id":"233988","referrer":"","search_engine":"","search_query":"","mkwid":"","gclid":"","utm_source":"google","utm_campaign":"","utm_medium":"cpc","utm_content":"brian-pettiford","utm_term":"","ruid":"patient_advocates","campaign_id":"Asbestos.com Google AdWords Search","is_paid":true,"lead_attribution":"Paid","adwords_device":"Mobile","luid":"PT0000000000000001","lead_processed_date":"2018-08-23T20:55:51+00:00","effect":"N/A","invoca_call_duration":130}}
// Web - {"lead_id":1,"site_id":1,"vertical_id":1,"route_id":1,"channel":"web","rule_version":2,"fields":{"w_url":"https://app.woopra.com/project/asbestoslungcancer.org/people/people:default/profile/Hhbv170e6dFc","test_field":"testing \r\n did it \"work\"? I'm not sure","shuttle_key":"c30856a6-11f9-470c-b3f6-79a0ea2d0cb0","full_name":"Beau Test","first_name":"Beau","last_name":"Test","phone":"213-955-1200","city":"Los Angeles","state":"CA","ip_address":"","heirial2":"","heirial2_uid":"","telescope_id":"","vertical":"Test","source":"Test","lead_type":"Phone","sf_record_type":"01215000001YjJU","referrer":"","search_engine":"","search_query":"","mkwid":"","gclid":"","utm_source":"google","utm_campaign":"","utm_medium":"cpc","utm_content":"brian-pettiford","utm_term":"","ruid":"patient_advocates","campaign_id":"Asbestos.com Google AdWords Search","is_paid":true,"lead_attribution":"Paid","adwords_device":"Mobile","luid":"PT0000000000000001","lead_processed_date":"2018-08-23T20:55:51+00:00","effect":"N/A"}}
