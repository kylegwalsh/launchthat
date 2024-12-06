// *** HANDLER ***

// Import everything needed for testing (the function, config, helper libraries)
import { handler } from '../functions/formatChat';
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

    // *** SITE ENDPOINTS ***

    // If they are requesting the site URL, return the site data
    if (url === `${config.api.homebase.url}/sites?domain=asbestos.com`) {
      data = mockData.appKey;
      console.log('Running app key:', data);
    }
    else if (url === `${config.api.homebase.url}/sites?domain=error.com`) {
      console.log('Running app key error:', data);
      throw new Error('Mission failed, we\'ll get em next time');
    }

    // *** END SITE ENDPOINTS ***

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
  channel: 'chat'
};

/**
 * The chat message for a normal chat
 */
const normalChat = {  
  event_type: 'chat_ended',
  event_unique_id: 'ada4c1188e8762df7d6e9431182e1906',
  token: '86f4a64637ec80d33da816f33f43a806',
  license_id: '5015831',
  lc_version: '2',
  chat: {  
    id: 'PR8G5BAYCT',
    started_timestamp: 1557766037,
    ended_timestamp: 1557766380,
    url: 'https://www.annuity.org/annuities/beneficiaries/',
    referer: 'https://www.google.com/',
    messages: [  
      {  
        user_type: 'agent',
        author_name: 'Gary Grossett',
        agent_id: 'ggrossett@cbcsettlementfunding.com',
        text: 'Hello Bob Bobby. How may I help you?',
        json: '',
        timestamp: 1557766037
      },
      {  
        user_type: 'visitor',
        author_name: 'Bob Bobby',
        text: 'Hello, my name is Bob. \nI\'m looking for assistance',
        json: '',
        timestamp: 1557766321
      },
      {  
        user_type: 'agent',
        author_name: 'Gary Grossett',
        agent_id: 'ggrossett@cbcsettlementfunding.com',
        text: 'We are not able to provide tax, legal, or financial advice.',
        json: '{}',
        timestamp: 1557766357
      },
      {  
        user_type: 'visitor',
        author_name: 'Bob Bobby',
        text: 'Thank you!',
        json: '',
        timestamp: 1557766376
      }
    ],
    attachments: [],
    events: [  
      {  
        user_type: 'visitor',
        text: 'Bob Bobby closed the chat.',
        timestamp: 1557766380,
        type: 'closed'
      }
    ],
    agents: [  
      {  
        name: 'Gary Grossett',
        login: 'ggrossett@cbcsettlementfunding.com'
      }
    ],
    tags: [],
    groups: [0]
  },
  visitor: {  
    id: 'S1557766017.8e5480fb0a',
    name: 'Bob Bobby',
    email: 'bob@email.com',
    custom_variables: [  
      {  
        key: 'hasCustomData',
        value: 'true'
      },
      {  
        key: 'site_id',
        value: '498567127237893'
      },
      {  
        key: 'campaign_id',
        value: 1
      },
    ],
    country: 'United States',
    city: 'Pine Bluff',
    language: 'en',
    page_current: 'https://www.annuity.org/annuities/beneficiaries/',
    timezone: 'America/Chicago'
  },
  pre_chat_survey: [  
    {  
      id: '142179377143804921',
      type: 'name',
      label: 'Name:',
      answer: 'Bob Bobby'
    },
    {  
      id: '142179377143803570',
      type: 'email',
      label: 'E-mail:',
      answer: 'bob@email.com'
    },
    {  
      id: '142179377143803571',
      type: 'phone',
      label: 'Phone Number:',
      answer: '407 123 4567'
    }
  ]
};

/**
 * The chat message for a bad chat (missing data)
 */
const badChat = {  
  event_type: 'chat_ended',
  event_unique_id: '26b55644acc66e0d29707449db1d86d1',
  token: '543f7423572806f3cc11a5941622ee9c',
  license_id: '2888902',
  lc_version: '2',
  chat: {  
    id: 'PQPJ5091JW',
    started_timestamp: 1556211122,
    ended_timestamp: 1556211171,
    // tslint:disable-next-line: max-line-length
    url: 'https://secure.livechatinc.com/licence/2888902/v2/open_chat.cgi?groups=3&mobile=1&__lc_vv=2&session_id=S1556176609.3101882c47&server=secure.livechatinc.com#https%3A%2F%2Fwww.asbestos.com%2Fthank-you%2F%3F109596%26diagnosis%3Dmesothelioma',
    referer: 'https://www.asbestos.com/thank-you/?109596&diagnosis=mesothelioma',
    messages: [  
      {  
        user_type: 'agent',
        author_name: 'Snehal Smart',
        agent_id: 'ssmart@asbestos.com',
        text: 'Hello Bob. How may I help you?',
        json: '',
        timestamp: 1556211122
      }
    ],
    attachments: [],
    events: [  
      {  
        user_type: 'visitor',
        text: 'Bob left the chat.',
        timestamp: 1556211171,
        type: 'closed'
      }
    ],
    agents: [  
      {  
        name: 'Snehal Smart',
        login: 'ssmart@asbestos.com'
      }
    ],
    tags: [],
    groups: [3]
  },
  visitor: {  
    id: 'S1556210899.9d2add6115',
    name: 'Bob',
    email: 'bob@email.com',
    country: 'United Kingdom',
    city: 'Ilford',
    language: 'en',
    // tslint:disable-next-line: max-line-length
    page_current: 'https://secure.livechatinc.com/licence/2888902/v2/open_chat.cgi?groups=3&mobile=1&__lc_vv=2&session_id=S1556176609.3101882c47&server=secure.livechatinc.com#https%3A%2F%2Fwww.asbestos.com%2Fthank-you%2F%3F109596%26diagnosis%3Dmesothelioma',
    timezone: 'Europe/London'
  },
  pre_chat_survey: [  
    {  
      id: '140000886504404416',
      type: 'name',
      label: 'Name:',
      answer: 'Bob'
    },
    {  
      id: '140000886504402132',
      type: 'email',
      label: 'E-mail:',
      answer: 'bob@email.com'
    }
  ]
};

/**
 * The chat message for a ticket
 */
const ticket = {  
  event_type: 'ticket_created',
  token: '6115ca6fff5eef933f97a4d46bdc4584',
  license_id: '2888902',
  ticket: {  
    events: [  
      {  
        author: {  
          id: 'bob@email.com',
          name: 'Bob Bobby',
          type: 'client'
        },
        date: '2019-05-14T11:48:10Z',
        is_private: false,
        // tslint:disable-next-line: max-line-length
        message: 'Phone Number: 1(692) 456-4694\n\nMessage:\nReally need assistant with my studies.\nI would appreciate assistance.\n\nhasCustomData: true\nheirial_id: 4071ae24-696a-434a-9ca7-f8862e4ad4e2::82d0f640-6d11-4385-bcd7-7642ee3738a4::c4098294-d21f-49b0-b652-e1486c2f9ba7\ncampaign_id=1\nsite_id=1\nwookie_id: \nga_id: GA1.2.772717620.1557833768\nsite_id: 274572392373246\nruid: patient_advocates\nip: 203.78.155.163\n',
        type: 'message',
        source: {  
          url: 'https://www.asbestos.com/mesothelioma/pericardial/effusion/',
          type: 'chat-window'
        }
      }
    ],
    groups: [  
      {  
        id: 3,
        name: 'Asbestos.com',
        inherited: true
      }
    ],
    id: 'NGKW7',
    requester: {  
      mail: 'bob@email.com',
      name: 'Bob Bobby',
      utc_offset: 'Pacific/Fiji',
      ip: '203.78.155.163'
    },
    status: 'open',
    subject: 'Nursing of Adult 222',
    tags: [  

    ],
    source: {  
      type: 'chat-window',
      url: 'https://www.asbestos.com/mesothelioma/pericardial/effusion/'
    }
  }
};

/**
 * Default data objects from each endpoint (not all will be used at once)
 */
const defaultData = {
  /**
   * Data to return when requesting an app key
   */
  appKey: [{
    appKey: '1'
  }]
};

// *** TESTS ***

// Test for formatChat handler
describe('Format Chat Tests', () => {

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
  test('Chat (No Missing Info)', async() => {
    // Attach the normal chat to the input
    input.chat = JSON.parse(JSON.stringify(normalChat));

    // Mock event received by handler
    const event = {
      body: JSON.stringify(input),
    };

    // Run handler
    const result = await handler(event);

    // Verify the function returns success
    expect(result.statusCode).toBe(200);

    // Verify there is 1 request (1 to SQS - aggregate)
    expect(mockRequests.length).toBe(1);

    // Verify only request is a call to SQS (to move to next function)
    expect(mockRequests[0].params.QueueUrl).toBe(`${config.sqs.urls.prefix}mailroom-intake-${process.env.stage}-aggregate`);
    // Verify all general fields were parsed correctly
    expect(JSON.parse(mockRequests[0].params.MessageBody).campaign_id).toBe(1);
    expect(JSON.parse(mockRequests[0].params.MessageBody).app_key).toBe('498567127237893');
    expect(JSON.parse(mockRequests[0].params.MessageBody).fields.chat_id).toBe('PR8G5BAYCT');
    expect(JSON.parse(mockRequests[0].params.MessageBody).fields.initial_url).toBe('https://www.annuity.org/annuities/beneficiaries/');
    expect(JSON.parse(mockRequests[0].params.MessageBody).fields.email).toBe('bob@email.com');
    expect(JSON.parse(mockRequests[0].params.MessageBody).fields.full_name).toBe('Bob Bobby');
    // Verify all chat specific fields were parsed correctly
    expect(JSON.parse(mockRequests[0].params.MessageBody).fields.chat_start_time).toBe('2019-05-13T16:47:17.000Z');
    expect(JSON.parse(mockRequests[0].params.MessageBody).fields.chat_end_time).toBe('2019-05-13T16:53:00.000Z');
    expect(JSON.parse(mockRequests[0].params.MessageBody).fields.chat_duration).toBe(343);
    expect(JSON.parse(mockRequests[0].params.MessageBody).fields.chat_type).toBe('posthook');
    expect(JSON.parse(mockRequests[0].params.MessageBody).fields.chat_operator).toBe('Gary Grossett');
    expect(JSON.parse(mockRequests[0].params.MessageBody).fields.phone).toBe('407 123 4567');
    expect(JSON.parse(mockRequests[0].params.MessageBody).fields.hasCustomData).toBe('true');
    // tslint:disable-next-line: max-line-length
    expect(JSON.parse(mockRequests[0].params.MessageBody).fields.chat_transcript).toBe('Gary Grossett: Hello Bob Bobby. How may I help you?\r\nBob Bobby: Hello, my name is Bob. \nI\'m looking for assistance\r\nGary Grossett: We are not able to provide tax, legal, or financial advice.\r\nBob Bobby: Thank you!\r\n');
  });

  // *** TEST 2 ***
  test('Chat (Missing Info)', async() => {
    // Attach the bad chat to the input
    input.chat = JSON.parse(JSON.stringify(badChat));

    // Mock event received by handler
    const event = {
      body: JSON.stringify(input),
    };

    // Run handler
    const result = await handler(event);

    // Verify the function returns success
    expect(result.statusCode).toBe(200);

    // Verify there are 2 request (1 to DB API, 1 to SQS - aggregate)
    expect(mockRequests.length).toBe(2);

    // Verify the first request was for the app key
    expect(mockRequests[0].url).toBe(`${config.api.homebase.url}/sites?domain=asbestos.com`);

    // Verify last request is a call to SQS (to move to next function)
    expect(mockRequests[1].params.QueueUrl).toBe(`${config.sqs.urls.prefix}mailroom-intake-${process.env.stage}-aggregate`);
    // Verify all general fields were parsed correctly
    expect(JSON.parse(mockRequests[1].params.MessageBody).campaign_id).toBe(6);
    expect(JSON.parse(mockRequests[1].params.MessageBody).app_key).toBe('1');
    expect(JSON.parse(mockRequests[1].params.MessageBody).fields.chat_id).toBe('PQPJ5091JW');
    // tslint:disable-next-line: max-line-length
    expect(JSON.parse(mockRequests[1].params.MessageBody).fields.initial_url).toBe('https://secure.livechatinc.com/licence/2888902/v2/open_chat.cgi?groups=3&mobile=1&__lc_vv=2&session_id=S1556176609.3101882c47&server=secure.livechatinc.com#https%3A%2F%2Fwww.asbestos.com%2Fthank-you%2F%3F109596%26diagnosis%3Dmesothelioma');
    expect(JSON.parse(mockRequests[1].params.MessageBody).fields.email).toBe('bob@email.com');
    expect(JSON.parse(mockRequests[1].params.MessageBody).fields.full_name).toBe('Bob');
    // Verify all chat specific fields were parsed correctly
    expect(JSON.parse(mockRequests[1].params.MessageBody).fields.chat_start_time).toBe('2019-04-25T16:52:02.000Z');
    expect(JSON.parse(mockRequests[1].params.MessageBody).fields.chat_end_time).toBe('2019-04-25T16:52:51.000Z');
    expect(JSON.parse(mockRequests[1].params.MessageBody).fields.chat_duration).toBe(49);
    expect(JSON.parse(mockRequests[1].params.MessageBody).fields.chat_type).toBe('posthook');
    expect(JSON.parse(mockRequests[1].params.MessageBody).fields.chat_operator).toBe('Snehal Smart');
    // tslint:disable-next-line: max-line-length
    expect(JSON.parse(mockRequests[1].params.MessageBody).fields.chat_transcript).toBe('Snehal Smart: Hello Bob. How may I help you?\r\n');
  });

  // // *** TEST 3 ***
  test('Ticket', async() => {
    // Attach the ticket to the input
    input.chat = JSON.parse(JSON.stringify(ticket));

    // Mock event received by handler
    const event = {
      body: JSON.stringify(input),
    };

    // Run handler
    const result = await handler(event);

    // Verify the function returns success
    expect(result.statusCode).toBe(200);

    // Verify there is 1 request (1 to SQS - aggregate)
    expect(mockRequests.length).toBe(1);

    // Verify only request is a call to SQS (to move to next function)
    expect(mockRequests[0].params.QueueUrl).toBe(`${config.sqs.urls.prefix}mailroom-intake-${process.env.stage}-aggregate`);
    // Verify all general fields were parsed correctly
    expect(JSON.parse(mockRequests[0].params.MessageBody).campaign_id).toBe(6);
    expect(JSON.parse(mockRequests[0].params.MessageBody).app_key).toBe('274572392373246');
    expect(JSON.parse(mockRequests[0].params.MessageBody).fields.chat_id).toBe('NGKW7');
    // tslint:disable-next-line: max-line-length
    expect(JSON.parse(mockRequests[0].params.MessageBody).fields.initial_url).toBe('https://www.asbestos.com/mesothelioma/pericardial/effusion/');
    expect(JSON.parse(mockRequests[0].params.MessageBody).fields.email).toBe('bob@email.com');
    expect(JSON.parse(mockRequests[0].params.MessageBody).fields.full_name).toBe('Bob Bobby');
    // Verify all ticket specific fields were parsed correctly
    expect(JSON.parse(mockRequests[0].params.MessageBody).fields.chat_type).toBe('ticket');
    expect(JSON.parse(mockRequests[0].params.MessageBody).fields.phone).toBe('1(692) 456-4694');
    expect(JSON.parse(mockRequests[0].params.MessageBody).fields.hasCustomData).toBe('true');
    // tslint:disable-next-line: max-line-length
    expect(JSON.parse(mockRequests[0].params.MessageBody).fields.chat_transcript).toBe('Really need assistant with my studies.I would appreciate assistance.');
  });

  // *** TEST 4 ***
  test('Error - No Chat Provided', async() => {
    // Do not attach a chat

    // Mock event received by handler
    const event = {
      body: JSON.stringify(input),
    };

    // Run handler
    const result = await handler(event);

    // Verify the function returns success
    expect(result.statusCode).toBe(500);

    // Verify there are 1 requests (1 to SQS - error)
    expect(mockRequests.length).toBe(1);

    // Verify only request is a call to SQS (error notification)
    expect(mockRequests[0].params.QueueUrl).toBe(config.sqs.urls.notification);
    // Verify slack is being sent the correct error details
    expect(JSON.parse(mockRequests[0].params.MessageBody).slack.channel).toBe(`#${config.slack.errorChannel}`);
    expect(JSON.parse(mockRequests[0].params.MessageBody).slack.attachments[0].text).not.toBeUndefined();
  });

  // *** TEST 5 ***
  test('Error - No Fallback Campaign', async() => {
    // Attach the normal chat
    input.chat = JSON.parse(JSON.stringify(normalChat));
    // Alter the domain
    input.chat.chat.url = 'https://www.fake.com';
    // Remove the campaign id
    input.chat.visitor.custom_variables[2].value = undefined;

    // Mock event received by handler
    const event = {
      body: JSON.stringify(input),
    };

    // Run handler
    const result = await handler(event);

    // Verify the function returns success
    expect(result.statusCode).toBe(500);

    // Verify there are 1 requests (1 to SQS - error)
    expect(mockRequests.length).toBe(1);

    // Verify only request is a call to SQS (error notification)
    expect(mockRequests[0].params.QueueUrl).toBe(config.sqs.urls.notification);
    // Verify slack is being sent the correct error details
    expect(JSON.parse(mockRequests[0].params.MessageBody).slack.channel).toBe(`#${config.slack.errorChannel}`);
    expect(JSON.parse(mockRequests[0].params.MessageBody).slack.attachments[0].text).not.toBeUndefined();
  });

  // *** TEST 6 ***
  test('Unexpected Error', async() => {
    // Attach the normal chat
    input.chat = JSON.parse(JSON.stringify(normalChat));
    // Alter the domain to cause an error
    input.chat.chat.url = 'https://www.error.com';
    // Remove the app key
    input.chat.visitor.custom_variables[1].value = undefined;

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

    // Verify the first request was for the app key
    expect(mockRequests[0].url).toBe(`${config.api.homebase.url}/sites?domain=error.com`);

    // Verify only request is a call to SQS (error notification)
    expect(mockRequests[1].params.QueueUrl).toBe(config.sqs.urls.notification);
    // Verify slack is being sent the correct error details
    expect(JSON.parse(mockRequests[1].params.MessageBody).slack.channel).toBe(`#${config.slack.errorChannel}`);
    expect(JSON.parse(mockRequests[1].params.MessageBody).slack.attachments[0].text).not.toBeUndefined();
  });

});

// JSON to use for formatChat testing

// tslint:disable-next-line: max-line-length
// Normal Chat - {"lead_id":1,"channel":"chat","chat":{"event_type":"chat_ended","event_unique_id":"ada4c1188e8762df7d6e9431182e1906","token":"86f4a64637ec80d33da816f33f43a806","license_id":"5015831","lc_version":"2","chat":{"id":"PR8G5BAYCT","started_timestamp":1557766037,"ended_timestamp":1557766380,"url":"https://www.annuity.org/annuities/beneficiaries/","referer":"https://www.google.com/","messages":[{"user_type":"agent","author_name":"Gary Grossett","agent_id":"ggrossett@cbcsettlementfunding.com","text":"Hello Yolanda Bush. How may I help you?","json":"","timestamp":1557766037},{"user_type":"agent","author_name":"Gary Grossett","agent_id":"ggrossett@cbcsettlementfunding.com","text":"How can I assist you today Yolanda?","json":"{}","timestamp":1557766237},{"user_type":"visitor","author_name":"Yolanda Bush","text":"Hello, my daughter's father passed away on March 29, 2019.  He was a retired teacher in Arkansas.  He made her the  primary beneficiary of his retirement  benefits which contains a TDrop  account.  The options  to obtain the funds were a Lump Sum and a roll-over option.  Which is the best option to consider.","json":"","timestamp":1557766321},{"user_type":"agent","author_name":"Gary Grossett","agent_id":"ggrossett@cbcsettlementfunding.com","text":"We are not able to provide tax, legal, or financial advice.","json":"{}","timestamp":1557766357},{"user_type":"agent","author_name":"Gary Grossett","agent_id":"ggrossett@cbcsettlementfunding.com","text":"We purchase the rights to receive structured settlement and annuity payments that are being distributed by an insurance company.","json":"{}","timestamp":1557766364},{"user_type":"visitor","author_name":"Yolanda Bush","text":"Thank you!","json":"","timestamp":1557766376}],"attachments":[],"events":[{"user_type":"visitor","text":"Yolanda Bush closed the chat.","timestamp":1557766380,"type":"closed"}],"agents":[{"name":"Gary Grossett","login":"ggrossett@cbcsettlementfunding.com"}],"tags":[],"groups":[0]},"visitor":{"id":"S1557766017.8e5480fb0a","name":"Yolanda Bush","email":"ybush@wcmail.k12.ar.us","custom_variables":[{"key":"hasCustomData","value":"true"},{"key":"heirial_id","value":""},{"key":"ga_id","value":""},{"key":"site_id","value":"498567127237893"},{"key":"campaign_id","value":34},{"key":"ip","value":"165.29.24.125"}],"country":"United States","city":"Pine Bluff","language":"en","page_current":"https://www.annuity.org/annuities/beneficiaries/","timezone":"America/Chicago"},"pre_chat_survey":[{"id":"142179377143804921","type":"name","label":"Name:","answer":"Yolanda Bush"},{"id":"142179377143803570","type":"email","label":"E-mail:","answer":"ybush@wcmail.k12.ar.us"}]}}

// tslint:disable-next-line: max-line-length
// Bad Chat - {"lead_id":1,"channel":"chat","chat":{"event_type":"chat_ended","event_unique_id":"26b55644acc66e0d29707449db1d86d1","token":"543f7423572806f3cc11a5941622ee9c","license_id":"2888902","lc_version":"2","chat":{"id":"PQPJ5091JW","started_timestamp":1556211122,"ended_timestamp":1556211171,"url":"https://secure.livechatinc.com/licence/2888902/v2/open_chat.cgi?groups=3&mobile=1&__lc_vv=2&session_id=S1556176609.3101882c47&server=secure.livechatinc.com#https%3A%2F%2Fwww.asbestos.com%2Fthank-you%2F%3F109596%26diagnosis%3Dmesothelioma","referer":"https://www.asbestos.com/thank-you/?109596&diagnosis=mesothelioma","messages":[{"user_type":"agent","author_name":"Snehal Smart","agent_id":"ssmart@asbestos.com","text":"Hello Alison. How may I help you?","json":"","timestamp":1556211122}],"attachments":[],"events":[{"user_type":"visitor","text":"Alison left the chat.","timestamp":1556211171,"type":"closed"}],"agents":[{"name":"Snehal Smart","login":"ssmart@asbestos.com"}],"tags":[],"groups":[3]},"visitor":{"id":"S1556210899.9d2add6115","name":"Alison","email":"Alison.smith770@ntlworld.com","country":"United Kingdom","city":"Ilford","language":"en","page_current":"https://secure.livechatinc.com/licence/2888902/v2/open_chat.cgi?groups=3&mobile=1&__lc_vv=2&session_id=S1556176609.3101882c47&server=secure.livechatinc.com#https%3A%2F%2Fwww.asbestos.com%2Fthank-you%2F%3F109596%26diagnosis%3Dmesothelioma","timezone":"Europe/London"},"pre_chat_survey":[{"id":"140000886504404416","type":"name","label":"Name:","answer":"Alison"},{"id":"140000886504402132","type":"email","label":"E-mail:","answer":"Alison.smith770@ntlworld.com"}]}}

// tslint:disable-next-line: max-line-length
// Ticket - {"lead_id":1,"channel":"chat","chat":{"event_type":"ticket_created","token":"6115ca6fff5eef933f97a4d46bdc4584","license_id":"2888902","ticket":{"events":[{"author":{"id":"ghenos@cmistudent.com","name":"Gedrick Henos","type":"client"},"date":"2019-05-14T11:48:10Z","is_private":false,"message":"Phone Number: 1(692) 456-4694\n\nMessage:\nReally need assistant with my studies.\nI would appreciate assistance.\n\nhasCustomData: true\nheirial_id: 4071ae24-696a-434a-9ca7-f8862e4ad4e2::82d0f640-6d11-4385-bcd7-7642ee3738a4::c4098294-d21f-49b0-b652-e1486c2f9ba7\ncampaign_id=34\nsite_id=1\nwookie_id: \nga_id: GA1.2.772717620.1557833768\nsite_id: 274572392373246\nruid: patient_advocates\nip: 203.78.155.163\n","type":"message","source":{"url":"https://www.asbestos.com/mesothelioma/pericardial/effusion/","type":"chat-window"}}],"groups":[{"id":3,"name":"Asbestos.com","inherited":true}],"id":"NGKW7","requester":{"mail":"ghenos@cmistudent.com","name":"Gedrick Henos","utc_offset":"Pacific/Fiji","ip":"203.78.155.163"},"status":"open","subject":"Nursing of Adult 222","tags":[],"source":{"type":"chat-window","url":"https://www.asbestos.com/mesothelioma/pericardial/effusion/"}}}}