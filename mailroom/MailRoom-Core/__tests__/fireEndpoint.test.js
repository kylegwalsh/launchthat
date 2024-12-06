// *** HANDLER ***

// Import the controller handler for testing
import { handler } from '../functions/fireEndpoint';
import { Notification } from '../utilities';
import { getConfig } from '../config';

// Store config
let config;
// Stores input for event
let input;
// Stores input for event
let emailInput;
// Stores input for event
let fetchInput;

// *** DEFAULTS ***

// Default options for mocked event (used to generate event fed to handler and can be overridden in each test)
const defaultInput = {
  id: 1,
  site_name: 'Asbestos.com',
  route: {
    id: 1,
    name: 'patient_advocates',
  },
  lead_id: 73,
  lead_version: 1,
  channel: 'call',
  fields: {
    shuttle_key: 'c30856a6-11f9-470c-b3f6-79a0ea2d0cb0',
    invoca_hook_type: 'post',
    last_name: '213-955-1200',
    phone: '213-955-1200',
    city: 'Los Angeles',
    state: 'CA',
    invoca_call_id: 'C5898D42-C452BB82',
    invoca_call_start_time: '2018-10-26T01:26:35+00:00',
    invoca_call_keypresses: '',
    invoca_call_duration: 50,
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
  },
};

// Default options for mocked email (used to generate expected email output and can be overridden in each test)
const defaultEmailInput = {
  to: 'kwalsh@launchthat.com',
  route_name: 'patient_advocates',
  fields: {
    last_name: '213-955-1200',
    phone: '213-955-1200',
    luid: 'PT0000000000000073',
    vertical: 'Asbestos',
    source: 'Asbestos.com',
    lead_type: 'Phone',
    lead_attribution: 'Paid',
    invoca_hook_type: 'post',
    invoca_call_duration: 50,
  },
  channel: 'call',
  options: {
    cc: 'cc@launcthat.com',
    bcc: 'bcc@launcthat.com',
    subject: '{{last_name}} - {{lead_type}}',
    body: 'This is the vertical {{vertical}} and this is the source {{source}}',
    reply_to: 'no-reply2@launcthat.com',
  },
};

// Default options for mocked endpoint fields (used to generate expected endpoint fields received and can be overridden in each test)
const defaultFetchInput = {
  last: '213-955-1200',
  phone_number: '213-955-1200',
  luid: 'PT0000000000000073',
  source: 'Asbestos.com',
};

// Default data from DB (being mocked)
const defaultData = [
  // First DB query
  [
    [
      {
        type: 'email',
        type_id: 1,
      },
    ],
  ],
  // Second DB query (actual endpoint details)
  [
    [
      {
        id: 1,
        // Email endpoint properties
        recipient: 'kwalsh@launchthat.com',
        cc: 'cc@launcthat.com',
        bcc: 'bcc@launcthat.com',
        subject: '{{last_name}} - {{lead_type}}',
        body: 'This is the vertical {{vertical}} and this is the source {{source}}',
        reply_to: 'no-reply2@launcthat.com',
        // HTTP endpoint properties
        url: 'http://url.com',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        field_map_id: 1,
        strip_blanks: true,
        field_map: [
          {
            target: 'last_name',
            output: 'last',
          },
          {
            target: 'phone',
            output: 'phone_number',
          },
          {
            target: 'luid',
            output: 'luid',
          },
        ],
      },
    ],
  ],
];

// *** MOCKS ***

// Disable console log
console.log = jest.fn();

// Store url requested by fetch
let mockUrl;

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
            if (JSON.parse(params.Message).lead_id === -1) {
              // Store request in our requests array
              mockRequests.push(params);
              throw new Error('Did you try setting it to Wumbo?');
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

// Mock fetch
jest.mock('node-fetch', () => {
  return (url, params) => {
    // Store url requested
    mockUrl = url;

    // Store request in our requests array
    mockRequests.push(params);

    // Mock a bad response from an endpoint
    if (url === 'http://badResponse.com') {
      return {
        status: 500,
        statusText: 'Bad parameters',
        body: 'You shall not pass',
        headers: {
          get: () => {
            return false;
          },
        },
      };
    }

    // Mock a json endpoint THAT DOESN'T ACTUALLY RETURN JSON (looking at you campaign monitor)
    if (url === 'http://jsonEndpoint.com') {
      return {
        status: 200,
        statusText: "That ain't my J-SON",
        body: 'potato',
        headers: {
          get: () => {
            return ['application/json'];
          },
        },
        json: () => {
          return 'potato';
        },
      };
    }

    return {
      status: 200,
      statusText: 'Success',
      body: 'Hell yeah brother',
      headers: {
        get: () => {
          return false;
        },
      },
    };
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

// Test for Fire Endpoint controller
describe('Fire Endpoint Tests', () => {
  // Initialize config
  beforeAll(async () => {
    // Testing variable is used to avoid the 20 second refire timer during testing
    process.env.testing = true;
    process.env.stage = 'dev';
    config = await getConfig();
  });

  // Run before each test
  beforeEach(() => {
    // Empty requests array
    mockRequests = [];
    // Reset our mockData => the default data mocked from DB (used to provide data to handler and can be overridden in each test)
    mockData = JSON.parse(JSON.stringify(defaultData));
    // Get default input
    input = JSON.parse(JSON.stringify(defaultInput));
    // Get default email input
    emailInput = JSON.parse(JSON.stringify(defaultEmailInput));
    // Get default fetch input
    fetchInput = JSON.parse(JSON.stringify(defaultFetchInput));
  });

  // *** TEST 1 ***
  test('Email Endpoint', async () => {
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

    // Run function to generate email to compare against actual result
    const expectedEmail = await Notification.generateEmail(emailInput.to, emailInput.route_name, emailInput.fields, emailInput.options);

    // Run fire endpoint with mocked event
    const result = await handler(event);

    // Verify that function returned successfully
    expect(result.statusCode).toBe(200);

    // Verify there were 2 requests (2 SNS triggers to notification and handleResponse)
    expect(mockRequests.length).toBe(2);

    // Verify that the email was correctly sent
    expect(JSON.parse(mockRequests[0].Message).email).toEqual(expectedEmail);

    // Verify that the SNS trigger had the correct message to handleResponse
    expect(JSON.parse(mockRequests[1].Message).record.status).toBe(200);
  });

  // *** TEST 2 ***
  test('URL Endpoint - Official Field Map', async () => {
    // Set type to be http
    mockData[0][0][0].type = 'http';

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

    // Make fetchInput match official map
    fetchInput.source = undefined;

    // Expected HTTP request body to test against
    const expectedFetch = JSON.stringify(fetchInput);

    // Run fire endpoint with mocked event
    const result = await handler(event);

    // Verify that function returned successfully
    expect(result.statusCode).toBe(200);

    // Verify there were 2 requests (1 fetch call and 1 SNS trigger to handleResponse)
    expect(mockRequests.length).toBe(2);

    // Verify that the fetch body was correctly filtered and sent
    expect(mockRequests[0].body).toBe(expectedFetch);

    // Verify that the SNS trigger had the correct message to handleResponse
    expect(JSON.parse(mockRequests[1].Message).record.status).toBe(200);
  });

  // *** TEST 3 ***
  test('URL Endpoint - No Field Map', async () => {
    // Set all field maps to undefined
    mockData[1][0][0].field_map_id = undefined;
    mockData[1][0][0].field_map = undefined;
    // Set type to be http
    mockData[0][0][0].type = 'http';

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

    // Make fetchInput match all input
    fetchInput = {
      shuttle_key: 'c30856a6-11f9-470c-b3f6-79a0ea2d0cb0',
      invoca_hook_type: 'post',
      last_name: '213-955-1200',
      phone: '213-955-1200',
      city: 'Los Angeles',
      state: 'CA',
      invoca_call_id: 'C5898D42-C452BB82',
      invoca_call_start_time: '2018-10-26T01:26:35+00:00',
      invoca_call_duration: 50,
      vertical: 'Asbestos',
      source: 'Asbestos.com',
      lead_type: 'Phone',
      sf_record_type: '01215000001YjJU',
      invoca_campaign_name: 'Asbestos.com Google AdWords Search',
      invoca_promo_number: '877-591-1140',
      invoca_promo_description: 'utm_c=meso-doctors',
      invoca_destination_number: '321-430-2214',
      invoca_advertiser_id: '233988',
      utm_source: 'google',
      utm_medium: 'cpc',
      utm_content: 'brian-pettiford',
      ruid: 'patient_advocates',
      campaign_id: 'Asbestos.com Google AdWords Search',
      is_paid: '1',
      lead_attribution: 'Paid',
      adwords_device: 'Mobile',
      luid: 'PT0000000000000073',
      lead_processed_date: '2018-08-23T20:55:51+00:00',
      effect: 'N/A',
    };

    // Expected HTTP request body to test against
    const expectedFetch = JSON.stringify(fetchInput);

    // Run fire endpoint with mocked event
    const result = await handler(event);

    // Verify that function returned successfully
    expect(result.statusCode).toBe(200);

    // Verify there were 2 requests (1 fetch call and 1 SNS trigger to handleResponse)
    expect(mockRequests.length).toBe(2);

    // Verify that the fetch body was correctly filtered and sent
    expect(mockRequests[0].body).toBe(expectedFetch);

    // Verify that the SNS trigger had the correct message to handleResponse
    expect(JSON.parse(mockRequests[1].Message).record.status).toBe(200);
  });

  // *** TEST 4 ***
  test('URL Endpoint - Strip Blank Fields', async () => {
    // Set type to be http
    mockData[0][0][0].type = 'http';

    // Make input luid blank (will be filtered)
    input.fields.luid = '';

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

    // Make fetchInput match desired stripped input
    fetchInput.source = undefined;
    fetchInput.luid = undefined;

    // Expected HTTP request body to test against
    const expectedFetch = JSON.stringify(fetchInput);

    // Run fire endpoint with mocked event
    const result = await handler(event);

    // Verify that function returned successfully
    expect(result.statusCode).toBe(200);

    // Verify there were 2 requests (1 fetch call and 1 SNS trigger to handleResponse)
    expect(mockRequests.length).toBe(2);

    // Verify that the fetch body was correctly filtered and sent
    expect(mockRequests[0].body).toBe(expectedFetch);

    // Verify that the SNS trigger had the correct message to handleResponse
    expect(JSON.parse(mockRequests[1].Message).record.status).toBe(200);
  });

  // *** TEST 5 ***
  test('URL Endpoint - JSON, but not JSON', async () => {
    // This test is to make sure that we handle scenarios where endpoints return content type application/json, but don't actually send JSON...
    // Set type to be http
    mockData[0][0][0].type = 'http';
    mockData[1][0][0].url = 'http://jsonEndpoint.com';

    // Make input luid blank (will be filtered)
    input.fields.luid = '';

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

    // Make fetchInput match desired stripped input
    fetchInput.source = undefined;
    fetchInput.luid = undefined;

    // Expected HTTP request body to test against
    const expectedFetch = JSON.stringify(fetchInput);

    // Run fire endpoint with mocked event
    const result = await handler(event);

    // Verify that function returned successfully
    expect(result.statusCode).toBe(200);

    // Verify there were 2 requests (1 fetch call and 1 SNS trigger to handleResponse)
    expect(mockRequests.length).toBe(2);

    // Verify that the fetch body was correctly filtered and sent
    expect(mockRequests[0].body).toBe(expectedFetch);

    // Verify that the SNS trigger had the correct message to handleResponse
    expect(JSON.parse(mockRequests[1].Message).record.status).toBe(200);
    // Verify that the response body was correctly turned into JSON
    expect(JSON.parse(mockRequests[1].Message).record.body).toEqual({ message: 'potato' });
  });

  // *** TEST 6 ***
  test('URL Endpoint - Form Encoded', async () => {
    // Set type to be http
    mockData[0][0][0].type = 'http';

    // Make input luid blank (will be filtered)
    input.fields.luid = '';

    // Set the content type to form encoded
    mockData[1][0][0].headers['content-type'] = 'application/x-www-form-urlencoded';

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

    // Make fetchInput match desired stripped input
    fetchInput.source = undefined;
    fetchInput.luid = undefined;

    // Expected HTTP request body to test against
    let expectedFetch = '';
    let starting = true;

    for (const field in fetchInput) {
      // Prepend & if this is not the first iteration
      if (starting) starting = false;
      else if (fetchInput[field]) expectedFetch += '&';

      if (fetchInput[field]) expectedFetch += `${field}=${fetchInput[field]}`;
    }

    // Run fire endpoint with mocked event
    const result = await handler(event);

    // Verify that function returned successfully
    expect(result.statusCode).toBe(200);

    // Verify there were 2 requests (1 fetch call and 1 SNS trigger to handleResponse)
    expect(mockRequests.length).toBe(2);

    // Verify that the fetch body was correctly filtered and sent
    expect(mockRequests[0].body).toEqual(expectedFetch);

    // Verify that the SNS trigger had the correct message to handleResponse
    expect(JSON.parse(mockRequests[1].Message).record.status).toBe(200);
  });

  // *** TEST 7 ***
  test("URL Endpoint - Don't Strip Blank Fields", async () => {
    // Remove strip_blanks value
    mockData[1][0][0].strip_blanks = false;
    // Set type to be http
    mockData[0][0][0].type = 'http';

    // Make input luid blank (will not be filtered)
    input.fields.luid = '';

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

    // Match official field map input
    fetchInput.source = undefined;
    fetchInput.luid = '';

    // Expected HTTP request body to test against
    const expectedFetch = JSON.stringify(fetchInput);

    // Run fire endpoint with mocked event
    const result = await handler(event);

    // Verify that function returned successfully
    expect(result.statusCode).toBe(200);

    // Verify there were 2 requests (1 fetch call and 1 SNS trigger to handleResponse)
    expect(mockRequests.length).toBe(2);

    // Verify that the fetch body was correctly filtered and sent
    expect(mockRequests[0].body).toBe(expectedFetch);

    // Verify that the SNS trigger had the correct message to handleResponse
    expect(JSON.parse(mockRequests[1].Message).record.status).toBe(200);
  });

  // *** TEST 8 ***
  test('URL Endpoint - Twig URL', async () => {
    // Change URL to use twig
    mockData[1][0][0].url = 'http://url.com?luid={{luid}}';
    // Set type to be http
    mockData[0][0][0].type = 'http';

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

    // Make fetchInput match desired stripped input
    fetchInput.source = undefined;

    // Expected HTTP request body to test against
    const expectedUrl = `http://url.com?luid=${input.fields.luid}`;

    // Expected HTTP request body to test against
    const expectedFetch = JSON.stringify(fetchInput);

    // Run fire endpoint with mocked event
    const result = await handler(event);

    // Verify that function returned successfully
    expect(result.statusCode).toBe(200);

    // Verify there were 2 requests (1 fetch call and 1 SNS trigger to handleResponse)
    expect(mockRequests.length).toBe(2);

    // Verify that the url applied twig properly
    expect(mockUrl).toBe(expectedUrl);

    // Verify that the fetch body was correctly filtered and sent
    expect(mockRequests[0].body).toBe(expectedFetch);

    // Verify that the SNS trigger had the correct message to handleResponse
    expect(JSON.parse(mockRequests[1].Message).record.status).toBe(200);
  });

  // *** TEST 9 ***
  test('URL Endpoint - Error x 1 - Re-Fire', async () => {
    // Mock bad response by hitting fake bad url
    mockData[1][0][0].url = 'http://badResponse.com';
    // Set type to be http
    mockData[0][0][0].type = 'http';

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

    // Match official field map input
    fetchInput.source = undefined;

    // Expected HTTP request body to test against
    const expectedFetch = JSON.stringify(fetchInput);

    // Run fire endpoint with mocked event
    const result = await handler(event);

    // Verify that function returned successfully
    expect(result.statusCode).toBe(200);

    // Verify there were 2 requests (1 fetch call and 1 SNS trigger to fireEndpoint)
    expect(mockRequests.length).toBe(2);

    // Verify that the fetch body was correctly filtered and sent
    expect(mockRequests[0].body).toBe(expectedFetch);

    // Verify that the SNS trigger is meant to refire
    expect(JSON.parse(mockRequests[1].Message).retryCount).toBe(1);
  });

  // *** TEST 10 ***
  test('URL Endpoint - Error x 2 - Failure', async () => {
    // Mock bad response by hitting fake bad url
    mockData[1][0][0].url = 'http://badResponse.com';
    // Set type to be http
    mockData[0][0][0].type = 'http';

    // Pretend we are retrying the fire endpoint function
    input.retryCount = 1;

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

    // Match official field map input
    fetchInput.source = undefined;

    // Expected HTTP request body to test against
    const expectedFetch = JSON.stringify(fetchInput);

    // Run fire endpoint with mocked event
    const result = await handler(event);

    // Verify that function returned successfully
    expect(result.statusCode).toBe(200);

    // Verify there were 2 requests (1 fetch call and 1 SNS trigger to handleResponse)
    expect(mockRequests.length).toBe(2);

    // Verify that the fetch body was correctly filtered and sent
    expect(mockRequests[0].body).toBe(expectedFetch);

    // Verify that the SNS trigger had the correct message to handleResponse
    expect(JSON.parse(mockRequests[1].Message).record.status).toBe(500);
  });

  // *** TEST 11 ***
  test('Re-Fire Endpoint Manually', async () => {
    // Set type to be http
    mockData[0][0][0].type = 'http';

    // Assign responseId to input (as if we are refiring a response with a failed status manually)
    input.responseId = 1;

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

    // Match official field map input
    fetchInput.source = undefined;

    // Expected HTTP request body to test against
    const expectedFetch = JSON.stringify(fetchInput);

    // Run fire endpoint with mocked event
    const result = await handler(event);

    // Verify that function returned successfully
    expect(result.statusCode).toBe(200);

    // Verify there were 2 requests (1 fetch call and 1 SNS trigger to handleResponse)
    expect(mockRequests.length).toBe(2);

    // Verify that the fetch body was correctly filtered and sent
    expect(mockRequests[0].body).toBe(expectedFetch);

    // Verify that the SNS trigger had the correct message to handleResponse
    expect(JSON.parse(mockRequests[1].Message).record.status).toBe(200);

    // Verify responseId was included
    expect(JSON.parse(mockRequests[1].Message).responseId).toBe(1);
  });

  // *** TEST 12 ***
  test('Unexpected Error', async () => {
    // Set type to be http
    mockData[0][0][0].type = 'http';
    // Set URL to be an endpoint
    mockData[0][0][0].url = 'http://endpoint.com';

    // Set luid to special val to trigger mocked error
    input.lead_id = -1;

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

    // Match official field map input
    fetchInput.source = undefined;

    // Expected HTTP request body to test against
    const expectedFetch = JSON.stringify(fetchInput);

    // Run fire endpoint with mocked event
    const result = await handler(event);

    // Verify that function returned successfully
    expect(result.statusCode).toBe(500);

    // Verify there were 2 requests (1 fetch call, 1 attempted SNS to handle success and 1 SNS trigger to notification)
    expect(mockRequests.length).toBe(3);

    // Verify that the fetch body was correctly filtered and sent
    expect(mockRequests[0].body).toBe(expectedFetch);

    // Verify that the SNS trigger was to the slack error channel
    expect(JSON.parse(mockRequests[2].Message).slack.channel).toBe(`#${config.slack.errorChannel}`);

    // Verify that the title is linked properly
    expect(JSON.parse(mockRequests[2].Message).slack.attachments[0].title_link).toBe(
      `${config.mailRoomURL}/leads/${input.lead_id}/${input.lead_version}`
    );
  });
});
