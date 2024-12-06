// *** HANDLER ***

// Import everything needed for testing (the function, config, helper libraries)
import { handler } from '../functions/aggregate';
import { getConfig } from '../config';

// Declare test variables
let config: any, input: any;

// *** MOCKS ***

// Disable console logs (they clutter up test results)
// If you are trying to debug unit tests, just comment it out
console.log = jest.fn();

/**
 * Store mocked requests for testing
 */
let mockRequests: any[] = [];
/**
 * Store mocked data (responses from endpoints in this case)
 */
let mockData: any = {};

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
            return;
          }
        };
      }
    },
    // SQS class
    SQS: class {
      sendMessage(params) {
        // Store request in our requests array
        mockRequests.push({ params });

        return {
          promise: () => {
            return;
          }
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
                  Name: 'woopra-api-secret',
                  Value: 'secret'
                }
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
    let status = 200;
    let data;

    // Store request in our requests array
    mockRequests.push({ url, params });

    // *** SITE ENDPOINTS ***

    // If they are requesting the site URL, return the site data
    if (url === `${config.api.homebase.url}/sites?appKey=${defaultInput.app_key}`) {
      data = mockData.site;
      console.log('Running site:', data);
    }
    // If they are requesting the error site (-1), return an empty object (error)
    else if (url === `${config.api.homebase.url}/sites?appKey=-1`) {
      status = 500;
      data = {};
      console.log('Running site error:', data);
    }
    else if (url === `${config.api.homebase.url}/sites?appKey=error`) {
      throw new Error('An arrow to the knee');
    }

    // *** END SITE ENDPOINTS ***
    // *** CAMPAIGN ENDPOINTS ***

    // If they are requesting the campaign URL, return the campaign data
    else if (url === `${config.api.homebase.url}/campaign_details/?id=${defaultInput.campaign_id}`) {
      data = mockData.campaign;
      console.log('Running campaign:', data);
    }
    // If they are requesting the error campaign (-1), return an empty object (error)
    else if (url === `${config.api.homebase.url}/campaign_details/?id=-1`) {
      status = 500;
      data = {};
      console.log('Running campaign error:', data);
    }

    // *** END CAMPAIGN ENDPOINTS ***
    // *** WOOPRA ENDPOINTS ***

    // If they are requesting the woopra conversion URL, just return (object doesn't matter)
    else if (url === 'https://www.woopra.com/track/ce') {
      data = mockData.woopra.conversion;
      console.log('Running woopra conversion:', data);
    }
    // If they are requesting the woopra actions URL, check the params to determine action
    else if (url === 'https://www.woopra.com/rest/3.0/profile/actions') {
      // If they are requesting with an error cookie, return an empty object (error)
      if (JSON.parse(params.body).cookie === -1) {
        status = 500;
        data = {};
        console.log('Running woopra actions error:', data);
      }
      // If they are requesting things normally, return the object
      else {
        data = mockData.woopra.actions;
        console.log('Running woopra actions:', data);
      }
    }

    // *** END WOOPRA ENDPOINTS ***
    // *** S3 ENDPOINTS ***

    // If they are requesting our s3 endpoint, store the data or retrieve
    else if (url.includes(config.storage.s3.endpoint)) {
      // If they are attempting to store the data, allow them to
      if (params.method === 'POST') {
        data = {};
        console.log('Running s3 store:', data);
      }
      // Otherwise, they are looking for previous woopra attribution
      else {
        // Lead 3 has existing s3 data stored and should be returned
        if (url.includes('fileName=3.json')) {
          // We'll return the normal woopra data, but modify the first campaign
          const woopraOverride = JSON.parse(JSON.stringify(mockData.woopra.actions));
          woopraOverride.timeline[0].events[0].payload.props[0][2] = 'test_campaign_3';
          data = woopraOverride;
        }
        // Other leads don't have any existing data and should use woopra's endpoint
        else {
          status = 500;
          data = {};
        }
        console.log('Running s3 retrieve:', data);
      }
    }
    // *** END S3 ENDPOINTS ***

    // Return the mocked response
    return {
      ok: status >= 200 && status < 300,
      status,
      statusText: 'mock',
      body: 'mock',
      headers: {
        get: () => {
          return 'application/json';
        }
      },
      // Return json body
      json: () => {
        return data;
      }
    };

  };
});

// *** DEFAULTS ***

/**
 * Default input for each test
 */
const defaultInput = {
  lead_id: 64892,
  channel: 'web',
  app_key: '498567127237893',
  campaign_id: 34,
  fields: {  
    shuttle_key: '10518e3f-1fa0-4118-94e8-bf8e517ee22b',
    full_name: 'Beau Test',
    first_name: 'Beau',
    last_name: 'Test',
    phone: '(800) 555-5555',
    email: 'test@test.com',
    tcpa_accepted: '1',
    tcpa_agreement: 'https://www.annuity.org/wp-content/themes/annuity/images/tcpa/free-estimate/compliance-201901011.png',
    payment_start_date: '/',
    type_of_payment: '',
    payment_amount: '',
    number_of_payments: '',
    payment_period: '',
    quote_amount: '',
    comments: '',
    pardot_visitor_id: '',
    cta_id: '',
    is_spanish: '0',
    vertical: 'Annuity',
    ruid: 'cbc',
    organization_id: '00DU0000000HM6K',
    affiliate_id: '',
    mkwid: '',
    requested_service: 'Free Estimate',
    ip_address: '170.55.166.138',
    heirial2: 'c04011ed-fb69-47ef-900d-94a88846cf1e::696202ec-fac3-4a34-9669-9d0272d1e3d3::a7e10497-c622-4858-b2e8-94fb8cf5c589',
    heirial2_data: '',
    heirial2_uid: 'c04011ed-fb69-47ef-900d-94a88846cf1e',
    heirial2_vid: '696202ec-fac3-4a34-9669-9d0272d1e3d3',
    heirial2_lid: 'a7e10497-c622-4858-b2e8-94fb8cf5c589',
    telescope_id: 'c04011ed-fb69-47ef-900d-94a88846cf1e::696202ec-fac3-4a34-9669-9d0272d1e3d3::a7e10497-c622-4858-b2e8-94fb8cf5c589',
    ga_user_id: 'GA1.2.98092756.1554471943',
    click_path: '',
    user_agent: '',
    device: '',
    browser: '',
    operating_system: '',
    ga_form_name: 'Free Estimate A',
    ga_form_location: 'Landing Page',
    wookie_id: 'opOBdL55T1If',
    source: 'Annuity.org',
    lead_type: 'Form',
    referrer: '',
    is_paid: '0',
    lead_attribution: '',
    gclid: '',
    utm_source: '',
    utm_campaign: '',
    utm_medium: '',
    utm_content: '',
    utm_term: '',
    adwords_matchtype: '',
    adwords_network: '',
    adwords_device: '',
    adwords_devicemodel: '',
    adwords_creative: '',
    adwords_adposition: ''
  }
};

/**
 * Default data objects from each endpoint (not all will be used at once)
 */
const defaultData = {
  /**
   * Data to return when requesting the site details
   */
  site: [{
    id: 1,
    domain: 'test.com',
    name: 'Test.com'
  }],
  /**
   * Data to return when requesting the campaign details
   */
  campaign: {
    vertical_id: 1,
    default: {
      route_id: 1,
      fields: {
        testField: 'default'
      }
    },
    paid: {
      route_id: 2,
      fields: {
        testField: 'paid'
      }
    }
  },
  /**
   * Data to return when requesting woopra
   */
  woopra: {
    /**
     * Conversion event is a POST (can be left blank)
     */
    conversion: null,
    /**
     * Actions event returns timeline with attribution data
     */
    actions: {
      timeline: [
        {
          meta: {
            total: 9,
            percent: 0
          },
          events: [
            {
              payload: {
                props: [
                  [
                    'qp_utm_campaign',
                    'qp_utm_campaign',
                    'test_campaign_1'
                  ],
                  [
                    'qp_utm_medium',
                    'qp_utm_medium',
                    'test_medium'
                  ],
                  [
                    'title',
                    'title',
                    'Annuity.org - Everything You Need to Know About Annuities'
                  ],
                  [
                    'uri',
                    'uri',
                    'https://www.annuity.org/?utm_campaign=test_campaign&utm_medium=test_medium'
                  ],
                  [
                    'url',
                    'url',
                    '/'
                  ],
                  [
                    'domain',
                    'domain',
                    'www.annuity.org'
                  ],
                ],
                duration: [
                  9,
                  '9 seconds'
                ],
                system: false,
                domain: 'annuity.org',
                name: 'pv',
              },
              type: 'event',
            },
            {
              payload: {
                props: [
                  [
                    'qp_utm_campaign',
                    'qp_utm_campaign',
                    'test_campaign_2'
                  ],
                  [
                    'qp_utm_medium',
                    'qp_utm_medium',
                    'test_medium'
                  ],
                  [
                    'title',
                    'title',
                    'Annuity.org - Everything You Need to Know About Annuities'
                  ],
                  [
                    'uri',
                    'uri',
                    'https://www.annuity.org/?utm_campaign=test_campaign&utm_medium=test_medium'
                  ],
                  [
                    'url',
                    'url',
                    '/'
                  ],
                  [
                    'domain',
                    'domain',
                    'www.annuity.org'
                  ],
                ],
                duration: [
                  9,
                  '9 seconds'
                ],
                system: false,
                domain: 'annuity.org',
                name: 'pv',
              },
              type: 'event',
            },
            {
              payload: {},
              type: 'session_started',
            },
          ]
        }
      ]
    }
  }
};

// *** TESTS ***

// Test for aggregate handler
describe('Aggregate Tests', () => {

  // Run before any test starts (get config)
  beforeAll(async() => {
    // Set the stage variable so the app can use it
    process.env.stage = 'dev';
    // Retrieve the config
    config = await getConfig();
  });

  // Run before each test to initialize the data they need
  beforeEach(() => {
    // Refresh our input object to match the default
    input = JSON.parse(JSON.stringify(defaultInput));
    // Refresh our data object to match the default
    mockData = JSON.parse(JSON.stringify(defaultData));
    // Reset our mockRequests array
    mockRequests = [];
  });

  // *** TEST 1 ***
  test('Woopra (Woopra Data)', async() => {
    // Mock event received by handler
    const event = {
      body: JSON.stringify(input),
    };

    // Run handler
    const result = await handler(event);

    // Verify the function returns success
    expect(result.statusCode).toBe(200);

    // Verify there are 7 requests (2 to DB API, 2 to Woopra, 2 to Storage API, 1 to SQS - next function)
    expect(mockRequests.length).toBe(7);

    // Verify the first request was for the site details
    expect(mockRequests[0].url).toBe(`${config.api.homebase.url}/sites?appKey=${input.app_key}`);

    // Verify the next request was for the campaign details
    expect(mockRequests[1].url).toBe(`${config.api.homebase.url}/campaign_details/?id=${input.campaign_id}`);

    // Verify the next request was for the woopra conversion
    expect(mockRequests[2].url).toBe('https://www.woopra.com/track/ce');
    expect(JSON.parse(mockRequests[2].params.body).project).toBe(defaultData.site[0].domain);
    expect(JSON.parse(mockRequests[2].params.body).cookie).toBe(input.fields.wookie_id);

    // Verify the next request was for the woopra actions (session)
    expect(mockRequests[3].url).toBe('https://www.woopra.com/rest/3.0/profile/actions');
    expect(JSON.parse(mockRequests[3].params.body).project).toBe(defaultData.site[0].domain);
    expect(JSON.parse(mockRequests[3].params.body).cookie).toBe(input.fields.wookie_id);

    // Verify the next request was for the s3 file (session)
    expect(mockRequests[4].url).toBe(config.storage.s3.endpoint + 
      `?bucket=${config.storage.s3.bucket}&fileName=${input.lead_id}.json&path=woopra`);
  
    // Verify the next request was to store the woopra data
    expect(mockRequests[5].url).toBe(config.storage.s3.endpoint);

    // Verify last request is a call to SQS (to move to next function)
    expect(mockRequests[6].params.QueueUrl).toBe(`${config.sqs.urls.prefix}mailroom-intake-${process.env.stage}-normalize`);
    // Verify campaign fields were grabbed
    expect(JSON.parse(mockRequests[6].params.MessageBody).campaign_fields.default.fields.testField).toBe('default');
    expect(JSON.parse(mockRequests[6].params.MessageBody).campaign_fields.paid.fields.testField).toBe('paid');
    // Verify fields were extracted from woopra properly
    expect(JSON.parse(mockRequests[6].params.MessageBody).fields.qp_utm_campaign).toBe('test_campaign_1');
    expect(JSON.parse(mockRequests[6].params.MessageBody).fields.qp_utm_medium).toBe('test_medium');
  });

  // *** TEST 2 ***
  test('Woopra (S3 Data)', async() => {
    // Change the lead_id so that it finds s3 data
    input.lead_id = 3;

    // Mock event received by handler
    const event = {
      body: JSON.stringify(input),
    };

    // Run handler
    const result = await handler(event);

    // Verify the function returns success
    expect(result.statusCode).toBe(200);

    // Verify there are 6 requests (2 to DB API, 2 to Woopra, 1 to Storage API, 1 to SQS - next function)
    expect(mockRequests.length).toBe(6);

    // Verify the first request was for the site details
    expect(mockRequests[0].url).toBe(`${config.api.homebase.url}/sites?appKey=${input.app_key}`);

    // Verify the next request was for the campaign details
    expect(mockRequests[1].url).toBe(`${config.api.homebase.url}/campaign_details/?id=${input.campaign_id}`);

    // Verify the next request was for the woopra conversion
    expect(mockRequests[2].url).toBe('https://www.woopra.com/track/ce');
    expect(JSON.parse(mockRequests[2].params.body).project).toBe(defaultData.site[0].domain);
    expect(JSON.parse(mockRequests[2].params.body).cookie).toBe(input.fields.wookie_id);

    // Verify the next request was for the woopra actions (session)
    expect(mockRequests[3].url).toBe('https://www.woopra.com/rest/3.0/profile/actions');
    expect(JSON.parse(mockRequests[3].params.body).project).toBe(defaultData.site[0].domain);
    expect(JSON.parse(mockRequests[3].params.body).cookie).toBe(input.fields.wookie_id);
  
    // Verify the next request was for the s3 file (session)
    expect(mockRequests[4].url).toBe(config.storage.s3.endpoint + 
      `?bucket=${config.storage.s3.bucket}&fileName=${input.lead_id}.json&path=woopra`);

    // Verify last request is a call to SQS (to move to next function)
    expect(mockRequests[5].params.QueueUrl).toBe(`${config.sqs.urls.prefix}mailroom-intake-${process.env.stage}-normalize`);
    // Verify campaign fields were grabbed
    expect(JSON.parse(mockRequests[5].params.MessageBody).campaign_fields.default.fields.testField).toBe('default');
    expect(JSON.parse(mockRequests[5].params.MessageBody).campaign_fields.paid.fields.testField).toBe('paid');
    
    // VERIFY THE S3 DATA WAS USED INSTEAD OF THE WOOPRA DATA
    expect(JSON.parse(mockRequests[5].params.MessageBody).fields.qp_utm_campaign).toBe('test_campaign_3');
    expect(JSON.parse(mockRequests[5].params.MessageBody).fields.qp_utm_medium).toBe('test_medium');
  });

  // *** TEST 3 ***
  test('No Woopra', async() => {
    // Remove woopra cookie (don't do any woopra related things)
    input.fields.wookie_id = null;

    // Mock event received by handler
    const event = {
      body: JSON.stringify(input),
    };

    // Run handler
    const result = await handler(event);

    // Verify the function returns success
    expect(result.statusCode).toBe(200);

    // Verify there are 3 requests (2 to DB API, 1 to SQS - next function)
    expect(mockRequests.length).toBe(3);

    // Verify the first request was for the site details
    expect(mockRequests[0].url).toBe(`${config.api.homebase.url}/sites?appKey=${input.app_key}`);

    // Verify the next request was for the campaign details
    expect(mockRequests[1].url).toBe(`${config.api.homebase.url}/campaign_details/?id=${input.campaign_id}`);

    // Verify last request is a call to SQS (to move to next function)
    expect(mockRequests[2].params.QueueUrl).toBe(`${config.sqs.urls.prefix}mailroom-intake-${process.env.stage}-normalize`);
    // Verify campaign fields were grabbed
    expect(JSON.parse(mockRequests[2].params.MessageBody).campaign_fields.default.fields.testField).toBe('default');
    expect(JSON.parse(mockRequests[2].params.MessageBody).campaign_fields.paid.fields.testField).toBe('paid');
  });

  // *** TEST 4 ***
  test('Bad Woopra Response', async() => {
    // Provide a bad app key
    input.fields.wookie_id = -1;
    
    // Mock event received by handler
    const event = {
      body: JSON.stringify(input),
    };

    // Run handler
    const result = await handler(event);

    // Verify the function returns success
    expect(result.statusCode).toBe(200);

    // Verify there are 7 requests (2 to DB API, 2 to Woopra, 1 to Storage API, 1 to SQS - warning, 1 to SQS - next function)
    expect(mockRequests.length).toBe(7);

    // Verify the first request was for the site details
    expect(mockRequests[0].url).toBe(`${config.api.homebase.url}/sites?appKey=${input.app_key}`);

    // Verify the next request was for the campaign details
    expect(mockRequests[1].url).toBe(`${config.api.homebase.url}/campaign_details/?id=${input.campaign_id}`);

    // Verify the next request was for the woopra conversion
    expect(mockRequests[2].url).toBe('https://www.woopra.com/track/ce');
    expect(JSON.parse(mockRequests[2].params.body).project).toBe(defaultData.site[0].domain);
    expect(JSON.parse(mockRequests[2].params.body).cookie).toBe(input.fields.wookie_id);

    // Verify the next request was for the woopra actions (session)
    expect(mockRequests[3].url).toBe('https://www.woopra.com/rest/3.0/profile/actions');
    expect(JSON.parse(mockRequests[3].params.body).project).toBe(defaultData.site[0].domain);
    expect(JSON.parse(mockRequests[3].params.body).cookie).toBe(input.fields.wookie_id);
  
    // Verify the next request was for the s3 file (session)
    expect(mockRequests[4].url).toBe(config.storage.s3.endpoint + 
      `?bucket=${config.storage.s3.bucket}&fileName=${input.lead_id}.json&path=woopra`);

    // Verify a warning message was sent to SQS (bad woopra response)
    expect(mockRequests[5].params.QueueUrl).toBe(config.sqs.urls.notification);
    // Verify slack is being sent the correct warning details
    expect(JSON.parse(mockRequests[5].params.MessageBody).slack.channel).toBe(`#${config.slack.errorChannel}`);
    expect(JSON.parse(mockRequests[5].params.MessageBody).slack.attachments[0].text).not.toBeUndefined();
    expect(JSON.parse(mockRequests[5].params.MessageBody).slack.attachments[0].color).toBe('warning');

    // Verify last request is a call to SQS (to move to next function)
    expect(mockRequests[6].params.QueueUrl).toBe(`${config.sqs.urls.prefix}mailroom-intake-${process.env.stage}-normalize`);
    // Verify campaign fields were grabbed
    expect(JSON.parse(mockRequests[6].params.MessageBody).campaign_fields.default.fields.testField).toBe('default');
    expect(JSON.parse(mockRequests[6].params.MessageBody).campaign_fields.paid.fields.testField).toBe('paid');
  });

  // *** TEST 5 ***
  test('Bad Campaign Response', async() => {
    // Provide a bad app key
    input.campaign_id = -1;
    
    // Mock event received by handler
    const event = {
      body: JSON.stringify(input),
    };

    // Run handler
    const result = await handler(event);

    // Verify the function returns success
    expect(result.statusCode).toBe(500);

    // Verify there are 3 requests (2 to DB API, 1 to SQS - error)
    expect(mockRequests.length).toBe(3);

    // Verify the first request was for the site details
    expect(mockRequests[0].url).toBe(`${config.api.homebase.url}/sites?appKey=${input.app_key}`);

    // Verify the next request was for the campaign details
    expect(mockRequests[1].url).toBe(`${config.api.homebase.url}/campaign_details/?id=${input.campaign_id}`);

    // Verify last request is a call to SQS (error notification)
    expect(mockRequests[2].params.QueueUrl).toBe(config.sqs.urls.notification);
    // Verify slack is being sent the correct error details
    expect(JSON.parse(mockRequests[2].params.MessageBody).slack.channel).toBe(`#${config.slack.errorChannel}`);
    expect(JSON.parse(mockRequests[2].params.MessageBody).slack.attachments[0].text).not.toBeUndefined();
  });

  // *** TEST 6 ***
  test('Bad Site Response', async() => {
    // Provide a bad app key (causes site error)
    input.app_key = -1;
    
    // Mock event received by handler
    const event = {
      body: JSON.stringify(input),
    };

    // Run handler
    const result = await handler(event);

    // Verify the function returns success
    expect(result.statusCode).toBe(500);

    // Verify there are 2 requests (1 to DB API, 1 to SQS - error)
    expect(mockRequests.length).toBe(2);

    // Verify the first request was for the site details
    expect(mockRequests[0].url).toBe(`${config.api.homebase.url}/sites?appKey=${input.app_key}`);

    // Verify last request is a call to SQS (error notification)
    expect(mockRequests[1].params.QueueUrl).toBe(config.sqs.urls.notification);
    // Verify slack is being sent the correct error details
    expect(JSON.parse(mockRequests[1].params.MessageBody).slack.channel).toBe(`#${config.slack.errorChannel}`);
    expect(JSON.parse(mockRequests[1].params.MessageBody).slack.attachments[0].text).not.toBeUndefined();
  });

  // *** TEST 7 ***
  test('Missing Routing Details (No Campaign ID)', async() => {
    // Remove campaign ID (no route info)
    input.campaign_id = null;
    
    // Mock event received by handler
    const event = {
      body: JSON.stringify(input),
    };

    // Run handler
    const result = await handler(event);

    // Verify the function returns success
    expect(result.statusCode).toBe(500);

    // Verify there are 2 requests (1 to DB API, 1 to SQS - error)
    expect(mockRequests.length).toBe(2);

    // Verify the first request was for the site details
    expect(mockRequests[0].url).toBe(`${config.api.homebase.url}/sites?appKey=${input.app_key}`);

    // Verify last request is a call to SQS (error notification)
    expect(mockRequests[1].params.QueueUrl).toBe(config.sqs.urls.notification);
    // Verify slack is being sent the correct error details
    expect(JSON.parse(mockRequests[1].params.MessageBody).slack.channel).toBe(`#${config.slack.errorChannel}`);
    expect(JSON.parse(mockRequests[1].params.MessageBody).slack.attachments[0].text).not.toBeUndefined();
  });

  // *** TEST 8 ***
  test('Unexpected Error', async() => {
    // Provide a VERY bad app_key (throw an actual error)
    input.app_key = 'error';
    
    // Mock event received by handler
    const event = {
      body: JSON.stringify(input),
    };

    // Run handler
    const result = await handler(event);

    // Verify the function returns success
    expect(result.statusCode).toBe(500);

    // Verify there are 2 requests (1 to DB API, 1 to SQS - error)
    expect(mockRequests.length).toBe(2);

    // Verify the first request was for the site details
    expect(mockRequests[0].url).toBe(`${config.api.homebase.url}/sites?appKey=${input.app_key}`);

    // Verify last request is a call to SQS (error notification)
    expect(mockRequests[1].params.QueueUrl).toBe(config.sqs.urls.notification);
    // Verify slack is being sent the correct error details
    expect(JSON.parse(mockRequests[1].params.MessageBody).slack.channel).toBe(`#${config.slack.errorChannel}`);
    expect(JSON.parse(mockRequests[1].params.MessageBody).slack.attachments[0].text).not.toBeUndefined();
  });
});

// JSON to use for formatChat testing

// tslint:disable-next-line: max-line-length
// Aggregate - {"lead_id":64892,"channel":"web","app_key":"498567127237893","campaign_id":34,"fields":{"shuttle_key":"10518e3f-1fa0-4118-94e8-bf8e517ee22b","full_name":"Beau Test","first_name":"Beau","last_name":"Test","phone":"(800) 555-5555","email":"test@test.com","tcpa_accepted":"1","tcpa_agreement":"https://www.annuity.org/wp-content/themes/annuity/images/tcpa/free-estimate/compliance-201901011.png","payment_start_date":"/","type_of_payment":"","payment_amount":"","number_of_payments":"","payment_period":"","quote_amount":"","comments":"","pardot_visitor_id":"","cta_id":"","is_spanish":"0","vertical":"Annuity","ruid":"cbc","organization_id":"00DU0000000HM6K","affiliate_id":"","mkwid":"","requested_service":"Free Estimate","ip_address":"170.55.166.138","heirial2":"c04011ed-fb69-47ef-900d-94a88846cf1e::696202ec-fac3-4a34-9669-9d0272d1e3d3::a7e10497-c622-4858-b2e8-94fb8cf5c589","heirial2_data":"","heirial2_uid":"c04011ed-fb69-47ef-900d-94a88846cf1e","heirial2_vid":"696202ec-fac3-4a34-9669-9d0272d1e3d3","heirial2_lid":"a7e10497-c622-4858-b2e8-94fb8cf5c589","telescope_id":"c04011ed-fb69-47ef-900d-94a88846cf1e::696202ec-fac3-4a34-9669-9d0272d1e3d3::a7e10497-c622-4858-b2e8-94fb8cf5c589","ga_user_id":"GA1.2.98092756.1554471943","click_path":"","user_agent":"","device":"","browser":"","operating_system":"","ga_form_name":"Free Estimate A","ga_form_location":"Landing Page","wookie_id":"opOBdL55T1If","source":"Annuity.org","lead_type":"Form","referrer":"","is_paid":"0","lead_attribution":"","gclid":"","utm_source":"","utm_campaign":"","utm_medium":"","utm_content":"","utm_term":"","adwords_matchtype":"","adwords_network":"","adwords_device":"","adwords_devicemodel":"","adwords_creative":"","adwords_adposition":""}}