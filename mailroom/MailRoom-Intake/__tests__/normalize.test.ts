// *** HANDLER ***

// Import everything needed for testing (the function, config, helper libraries)
import { handler } from '../functions/normalize';
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
        // Store request in our requests array
        mockRequests.push({ params });

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
    const status = 200;
    let data;

    // Store request in our requests array
    mockRequests.push({ url, params });

    // *** RULE ENDPOINTS ***

    // If they are requesting the site URL, return the site data
    if (url === `${config.api.homebase.url}/rules?order[version]=desc`) {
      data = mockData.rules;
      console.log('Running rules:', data);
    }

    // *** END RULE ENDPOINTS ***

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
  site_id: 1,
  channel: 'web',
  fields: {  
    shuttle_key: '10518e3f-1fa0-4118-94e8-bf8e517ee22b',
    full_name: 'Kyle Walsh',
    first_name: 'Kyle',
    last_name: 'Walsh',
    phone: '(800) 555-5555',
    email: 'test@test.com',
    tcpa_accepted: '1',
    tcpa_agreement: 'https://www.annuity.org/wp-content/themes/annuity/images/tcpa/free-estimate/compliance-201901011.png',
    payment_start_date: '/',
    is_spanish: '0',
    vertical: 'Annuity',
    ruid: 'cbc',
    organization_id: '00DU0000000HM6K',
    requested_service: 'Free Estimate',
    ip_address: '170.55.166.138',
    heirial2: 'c04011ed-fb69-47ef-900d-94a88846cf1e::696202ec-fac3-4a34-9669-9d0272d1e3d3::a7e10497-c622-4858-b2e8-94fb8cf5c589',
    heirial2_data: '',
    heirial2_uid: 'c04011ed-fb69-47ef-900d-94a88846cf1e',
    heirial2_vid: '696202ec-fac3-4a34-9669-9d0272d1e3d3',
    heirial2_lid: 'a7e10497-c622-4858-b2e8-94fb8cf5c589',
    telescope_id: 'c04011ed-fb69-47ef-900d-94a88846cf1e::696202ec-fac3-4a34-9669-9d0272d1e3d3::a7e10497-c622-4858-b2e8-94fb8cf5c589',
    ga_user_id: 'GA1.2.98092756.1554471943',
    operating_system: '',
    ga_form_name: 'Free Estimate A',
    ga_form_location: 'Landing Page',
    wookie_id: 'opOBdL55T1If',
    source: 'Annuity.org',
    lead_type: 'Form',
    referrer: '',
    is_paid: '0',
    lead_attribution: 'Paid',
    qp_utm_term: 'test'
  },
  campaign_fields: {
    default: {
      route_id: 2,
      fields: { 
        campaign_field_example: 'default',
        first_name: 'NoName' 
      } 
    },
    paid: { 
      route_id: 3, 
      fields: { 
        campaign_field_example: 'paid', 
        first_name: 'NoName' 
      } 
    }
  } 
};

/**
 * Default data objects from each endpoint (not all will be used at once)
 */
const defaultData = {
  /**
   * Data to return when requesting the rules endpoint
   */
  rules: [{
    version: 2,
    rules: {  
      web: [  
        {  
          key: 'lead_type',
          value: 'Form'
        },
        {  
          key: 'sf_record_type',
          value: '01215000001YjJW'
        }
      ],
      call: [  
        {  
          key: 'lead_type',
          value: 'Phone'
        },
        {  
          key: 'sf_record_type',
          value: '01215000001YjJU'
        },
        {  
          key: 'invoca_call_start_time',
          value: '{{ invoca_call_start_time|date(\'c\') }}'
        },
        {  
          key: 'qp_lead_attribution',
          value: '{{ qp_lead_attribution ?: pipeExtract(\'l_attr\', invoca_campaign_name) }}'
        },
        {  
          key: 'qp_utm_source',
          value: '{{ qp_utm_source ?: pipeExtract(\'utm_s\', invoca_campaign_name) }}'
        },
        {  
          key: 'masstorts_campaign',
          value: '{{ masstorts_campaign ?: pipeExtract(\'masstorts_campaign\', invoca_campaign_name) }}'
        },
        {  
          key: 'invoca_campaign_name',
          value: '{{ masstorts_campaign ?: pipeExtract(\'invoca_campaign\', invoca_campaign_name) }}'
        }
        // Removed a lot of invoca pipeExtract rules for space purposes
      ],
      facebook: [  
        {  
          key: 'lead_type',
          value: 'FB Lead Ad'
        },
        {  
          key: 'sf_record_type',
          value: '01215000001YjJW'
        },
        {  
          key: 'source',
          value: '{{ source }} Facebook Lead Ads'
        }
      ],
      chat: [
        {  
          key: 'lead_type',
          value: 'Chat'
        },
        {  
          key: 'sf_record_type',
          value: '01215000001YjJV'
        }
      ],
      general: [  
        {
          key: 'is_paid',
          value: '{{ qp_lead_attribution == \'Paid\' or qp_utm_term ? 1 : 0 }}'
        },
        {  
          key: 'qp_lead_attribution',
          value: '{{ qp_lead_attribution ?: \'Unknown\' }}'
        },
        {
          key: 'first_name',
          value: '{{ first_name ?: full_name | split(\' \', 2)[0] }}'
        },
        {  
          key: 'last_name',
          value: '{{ last_name ?: (full_name | split(\' \', 2)[1] ?: \'NoName\') }}'
        },
        {  
          key: 'full_name',
          value: '{{ full_name ?: (first_name ? first_name ~ \' \' : \'\') ~ last_name }}'
        },
        {  
          key: 'effect',
          value: '{{ effect ?: \'N/A\' }}'
        },
        {  
          key: 'lead_processed_date',
          value: '{{ \'now\'|date(\'c\') }}'
        }
      ]
    }
  }]
};

// *** TESTS ***

// Test for normalize handler
describe('Normalize Tests', () => {

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
  test('Web Normalization - Paid', async() => {
    // Mock event received by handler
    const event = {
      body: JSON.stringify(input),
    };

    // Run handler
    const result = await handler(event);

    // Verify the function returns success
    expect(result.statusCode).toBe(200);

    // Verify there are 2 requests (1 to DB API, 1 to SNS - mailroom-core)
    expect(mockRequests.length).toBe(2);

    // Verify the first request was for the site details
    expect(mockRequests[0].url).toBe(`${config.api.homebase.url}/rules?order[version]=desc`);

    // Verify last request is a call to SQS (to move to next function)
    expect(mockRequests[1].params.TopicArn).toBe(`${config.sns.topics.prefix}mailroom-core-${process.env.stage}-newLead`);
    // Verify the PAID route is being used
    expect(JSON.parse(mockRequests[1].params.Message).route_id).toBe(3);
    // Verify the PAID campaign fields were grabbed
    expect(JSON.parse(mockRequests[1].params.Message).fields.campaign_field_example).toBe('paid');
    // Verify that the first_name field was not overwritten because it was already defined
    expect(JSON.parse(mockRequests[1].params.Message).fields.first_name).toBe('Kyle');
  });

  // *** TEST 2 ***
  test('Web Normalization - Not Paid', async() => {
    // Remove paid fields
    input.fields.lead_attribution = 'Organic';
    input.fields.qp_utm_term = undefined;

    // Mock event received by handler
    const event = {
      body: JSON.stringify(input),
    };

    // Run handler
    const result = await handler(event);

    // Verify the function returns success
    expect(result.statusCode).toBe(200);

    // Verify there are 2 requests (1 to DB API, 1 to SNS - mailroom-core)
    expect(mockRequests.length).toBe(2);

    // Verify the first request was for the site details
    expect(mockRequests[0].url).toBe(`${config.api.homebase.url}/rules?order[version]=desc`);

    // Verify last request is a call to SQS (to move to next function)
    expect(mockRequests[1].params.TopicArn).toBe(`${config.sns.topics.prefix}mailroom-core-${process.env.stage}-newLead`);
    // Verify the DEFAULT route is being used
    expect(JSON.parse(mockRequests[1].params.Message).route_id).toBe(2);
    // Verify the DEFAULT campaign fields were grabbed
    expect(JSON.parse(mockRequests[1].params.Message).fields.campaign_field_example).toBe('default');
    // Verify that the first_name field was not overwritten because it was already defined
    expect(JSON.parse(mockRequests[1].params.Message).fields.first_name).toBe('Kyle');
  });

  // *** TEST 3 ***
  test('Call Normalization', async() => {
    // Change the lead type to call
    input.channel = 'call';
    input.fields = {
      shuttle_key: 'c30856a6-11f9-470c-b3f6-79a0ea2d0cb0',
      invoca_hook_type: 'pre',
      last_name: '251-635-3516',
      phone: '251-635-3516',
      city: 'Mobile',
      state: 'AL',
      invoca_call_id: '55942F47-5985694F',
      invoca_call_start_time: '2019-05-08 19:59:28 +00:00',
      invoca_call_keypresses: '',
      ip_address: '',
      heirial2: '1f395f84-af06-4858-8c0a-04cb235a0585::8bdb40a7-9573-448d-b78f-976777eeed8f::47b7176b-81f4-4d2e-9e7c-6a570a9f5c1b',
      heirial2_uid: '1f395f84-af06-4858-8c0a-04cb235a0585',
      wookie_id: 'Q0DNVYW2ZrzL',
      vertical: 'Asbestos',
      source: 'Asbestos.com',
      lead_type: 'Phone',
      sf_record_type: '01215000001YjJU',
      invoca_campaign_name: 'Default|is_sp=1|utm_s=Asbestos.com|l_attr=Paid|masstorts_campaign=test',
      invoca_promo_number: '844-650-2035',
      invoca_promo_description: 'utm_s=NotAsbestos.com|kw_id=123',
      invoca_destination_number: '321-430-2214',
      invoca_advertiser_id: '158478'
    };

    // Mock event received by handler
    const event = {
      body: JSON.stringify(input),
    };

    // Run handler
    const result = await handler(event);

    // Verify the function returns success
    expect(result.statusCode).toBe(200);

    // Verify there are 2 requests (1 to DB API, 1 to SNS - mailroom-core)
    expect(mockRequests.length).toBe(2);

    // Verify the first request was for the site details
    expect(mockRequests[0].url).toBe(`${config.api.homebase.url}/rules?order[version]=desc`);

    // Verify last request is a call to SQS (to move to next function)
    expect(mockRequests[1].params.TopicArn).toBe(`${config.sns.topics.prefix}mailroom-core-${process.env.stage}-newLead`);
    // Verify the invoca campaign fields pulled correctly
    expect(JSON.parse(mockRequests[1].params.Message).fields.qp_lead_attribution).toBe('Paid');
    // Verify the utm_source in the campaign name was chosen over the promo version
    expect(JSON.parse(mockRequests[1].params.Message).fields.qp_utm_source).toBe('Asbestos.com');
    // Verify the masstorts campaign replaced the masstorts_campaign field and the invoca_campaign_name field
    expect(JSON.parse(mockRequests[1].params.Message).fields.masstorts_campaign).toBe('test');
    expect(JSON.parse(mockRequests[1].params.Message).fields.invoca_campaign_name).toBe('test');
    // Verify the PAID route is being used
    expect(JSON.parse(mockRequests[1].params.Message).route_id).toBe(3);
    // Verify the PAID campaign fields were grabbed
    expect(JSON.parse(mockRequests[1].params.Message).fields.campaign_field_example).toBe('paid');
    expect(JSON.parse(mockRequests[1].params.Message).fields.first_name).toBe('NoName');
  });

  // *** TEST 4 ***
  test('No Campaign Details', async() => {
    // Erase the campaign fields (error)
    input.campaign_fields = undefined;

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
    expect(mockRequests[0].url).toBe(`${config.api.homebase.url}/rules?order[version]=desc`);

    // Verify last request is a call to SQS (error notification)
    expect(mockRequests[1].params.QueueUrl).toBe(config.sqs.urls.notification);
    // Verify slack is being sent the correct error details
    expect(JSON.parse(mockRequests[1].params.MessageBody).slack.channel).toBe(`#${config.slack.errorChannel}`);
    expect(JSON.parse(mockRequests[1].params.MessageBody).slack.attachments[0].text).not.toBeUndefined();
  });

  // *** TEST 5 ***
  test('Beau Test Route Override', async() => {
    // Make lead a beau test
    input.fields.full_name = 'Beau Test';

    // Mock event received by handler
    const event = {
      body: JSON.stringify(input),
    };

    // Run handler
    const result = await handler(event);

    // Verify the function returns success
    expect(result.statusCode).toBe(200);

    // Verify there are 2 requests (1 to DB API, 1 to SNS - mailroom-core)
    expect(mockRequests.length).toBe(2);

    // Verify the first request was for the site details
    expect(mockRequests[0].url).toBe(`${config.api.homebase.url}/rules?order[version]=desc`);

    // Verify last request is a call to SQS (to move to next function)
    expect(mockRequests[1].params.TopicArn).toBe(`${config.sns.topics.prefix}mailroom-core-${process.env.stage}-newLead`);
    // Verify the TEST route is being used
    expect(JSON.parse(mockRequests[1].params.Message).route_id).toBe(1);
  });

  // *** TEST 6 ***
  test('Unexpected Error', async() => {
    // Remove data in order to mock error
    mockData = undefined;

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
    expect(mockRequests[0].url).toBe(`${config.api.homebase.url}/rules?order[version]=desc`);

    // Verify last request is a call to SQS (error notification)
    expect(mockRequests[1].params.QueueUrl).toBe(config.sqs.urls.notification);
    // Verify slack is being sent the correct error details
    expect(JSON.parse(mockRequests[1].params.MessageBody).slack.channel).toBe(`#${config.slack.errorChannel}`);
    expect(JSON.parse(mockRequests[1].params.MessageBody).slack.attachments[0].text).not.toBeUndefined();
  });

});