// *** HANDLER ***

// Import the controller handler for testing
import { handler } from '../functions/handleResponse';
import { getConfig } from '../config';

// Store config
let config;
// Stores input for event
let input;

// *** DEFAULTS ***

// Default options for mocked event (used to generate event fed to handler and can be overridden in each test)
const defaultInput = {
  record: {
    status: 200,
    statusText: 'Success',
    body: {
      json: false,
    },
  },
  endpoint_id: 1,
  lead_id: 7,
  lead_version: 1,
  responseId: null,
  channel: 'Call',
  route: {
    id: 1,
    name: 'patient_advocates',
  },
  site_name: 'Asbestos.com',
};

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
            // Store request in our requests array
            mockRequests.push(params);
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
          execute: (query) => {
            if (
              query ===
              'INSERT INTO response_records (status_code, body, endpoint_id, reason_phrase, lead_id, lead_version) VALUES (-1, "{\\"json\\":false}", 1, "Success", 7, 1)'
            ) {
              throw new Error("If you ain't first, you're last!");
            } else {
              // Remove item from data array
              mockRequests.push(query);
              // Remove item from data array
              return mockData.shift();
            }
          },
          end: () => {
            return;
          },
        };
      },
    },
  };
});

// Default mockDB data
const defaultData = [
  // First DB query (insert record)
  [],
  // Second DB query (get num active endpoints)
  [[{ count: 2 }]],
  // Third DB query (get num success records)
  [[{ count: 2 }]],
  // Fourth DB query (update lead)
  [],
];

// *** HELPERS ***

const generateQueries = (event) => {
  return {
    insert: `INSERT INTO response_records (status_code, body, endpoint_id, reason_phrase, lead_id, lead_version) VALUES (${
      event.record.status
    }, "${JSON.stringify(event.record.body).replace(/"/g, '\\"')}", ${event.endpoint_id}, "${event.record.statusText}", ${event.lead_id}, ${
      event.lead_version
    })`,
    update: `UPDATE response_records SET status_code = ${event.record.status}, body = "${JSON.stringify(event.record.body).replace(
      /"/g,
      '\\"'
    )}", reason_phrase = "${event.record.statusText}" WHERE id = ${event.responseId}`,
    leadFail: `UPDATE leads SET delivery_status = "failed" WHERE id = ${event.lead_id} AND version = ${event.lead_version}`,
  };
};

// *** TESTS ***

// Test for handleResponse
describe('Handle Response Tests', () => {
  // Initialize config
  beforeAll(async () => {
    process.env.stage = 'dev';
    config = await getConfig();
  });

  // Run before each test
  beforeEach(() => {
    // Empty requests array
    mockRequests = [];
    // Get default input
    input = JSON.parse(JSON.stringify(defaultInput));
    // Reset mock data (only really used by success topic)
    mockData = JSON.parse(JSON.stringify(defaultData));
  });

  // *** TEST 1 ***
  test('Process Success Response - Insert', async () => {
    // Mock event received by handler
    const event = {
      Records: [
        {
          Sns: {
            Message: JSON.stringify(input),
            TopicArn: `${config.sns.mailroomPrefix}endpointSuccess`,
          },
        },
      ],
    };

    // The expected queries our DB should receive
    const expectedQueries = generateQueries(input);

    // Run controller with mocked event
    const result = await handler(event);

    // Verify that function returned successfully
    expect(result.statusCode).toBe(200);

    // Verify there were 4 requests (insert record, get endpoint count, get success count, update lead)
    expect(mockRequests.length).toBe(4);

    // Verify that the correct query ran (insert)
    expect(mockRequests[0]).toEqual(expectedQueries.insert);
  });

  // *** TEST 2 ***
  test('Process Success Response - Update', async () => {
    // Set response ID (we are updating an existing record)
    input.responseId = 1;

    // Mock event received by handler
    const event = {
      Records: [
        {
          Sns: {
            Message: JSON.stringify(input),
            TopicArn: `${config.sns.mailroomPrefix}endpointSuccess`,
          },
        },
      ],
    };

    // The expected queries our DB should receive
    const expectedQueries = generateQueries(input);

    // Run controller with mocked event
    const result = await handler(event);

    // Verify that function returned successfully
    expect(result.statusCode).toBe(200);

    // Verify there were 4 requests (insert record, get endpoint count, get success count, update lead)
    expect(mockRequests.length).toBe(4);

    // Verify that the correct query ran (update)
    expect(mockRequests[0]).toEqual(expectedQueries.update);
  });

  // *** TEST 3 ***
  test("Process Success Response - Don't Update Lead", async () => {
    // Set number of success records to 1 (not enough to merit lead success update)
    mockData[2][0][0].count = 1;

    // Mock event received by handler
    const event = {
      Records: [
        {
          Sns: {
            Message: JSON.stringify(input),
            TopicArn: `${config.sns.mailroomPrefix}endpointSuccess`,
          },
        },
      ],
    };

    // The expected queries our DB should receive
    const expectedQueries = generateQueries(input);

    // Run controller with mocked event
    const result = await handler(event);

    // Verify that function returned successfully
    expect(result.statusCode).toBe(200);

    // Verify there were only 3 requests (insert record, get endpoint count, get success count)
    expect(mockRequests.length).toBe(3);

    // Verify that the correct query ran (update)
    expect(mockRequests[0]).toEqual(expectedQueries.insert);
  });

  // *** TEST 3 ***
  test('Process Error Response - Insert', async () => {
    // Mock event received by handler
    const event = {
      Records: [
        {
          Sns: {
            Message: JSON.stringify(input),
            TopicArn: `${config.sns.mailroomPrefix}endpointFailure`,
          },
        },
      ],
    };

    // The expected queries our DB should receive
    const expectedQueries = generateQueries(input);

    // Run controller with mocked event
    const result = await handler(event);

    // Verify that function returned successfully
    expect(result.statusCode).toBe(200);

    // Verify there were 3 requests (1 slack error, 1 insert record, 1 lead failure update)
    expect(mockRequests.length).toBe(3);

    // Verify that the SNS trigger was to the slack error channel
    expect(JSON.parse(mockRequests[2].Message).slack.channel).toBe(`#${config.slack.errorChannel}`);

    // Verify title link is correct in the slack error
    expect(JSON.parse(mockRequests[2].Message).slack.attachments[0].title_link).toBe(
      `${config.mailRoomURL}/leads/${input.lead_id}/${input.lead_version}`
    );

    // Verify that the correct query ran (insert)
    expect(mockRequests[0]).toEqual(expectedQueries.insert);

    // Verify that the correct query ran (lead fail update)
    expect(mockRequests[1]).toEqual(expectedQueries.leadFail);
  });

  // *** TEST 4 ***
  test('Process Error Response - Update', async () => {
    // Set response ID (we are updating an existing record)
    input.responseId = 1;

    // Mock event received by handler
    const event = {
      Records: [
        {
          Sns: {
            Message: JSON.stringify(input),
            TopicArn: `${config.sns.mailroomPrefix}endpointFailure`,
          },
        },
      ],
    };

    // The expected queries our DB should receive
    const expectedQueries = generateQueries(input);

    // Run controller with mocked event
    const result = await handler(event);

    // Verify that function returned successfully
    expect(result.statusCode).toBe(200);

    // Verify there were 3 requests (1 slack error, 1 update record, 1 lead failure update)
    expect(mockRequests.length).toBe(3);

    // Verify that the SNS trigger was to the slack error channel
    expect(JSON.parse(mockRequests[2].Message).slack.channel).toBe(`#${config.slack.errorChannel}`);

    // Verify title link is correct in the slack error
    expect(JSON.parse(mockRequests[2].Message).slack.attachments[0].title_link).toBe(
      `${config.mailRoomURL}/leads/${input.lead_id}/${input.lead_version}`
    );

    // Verify that the correct query ran (update)
    expect(mockRequests[0]).toEqual(expectedQueries.update);

    // Verify that the correct query ran (lead fail update)
    expect(mockRequests[1]).toEqual(expectedQueries.leadFail);
  });

  // *** TEST 5 ***
  test('Unexpected Error', async () => {
    // Mock unexpected error by setting status to -1 (triggers error in db query)
    input.record.status = -1;

    // Mock event received by handler
    const event = {
      Records: [
        {
          Sns: {
            Message: JSON.stringify(input),
            TopicArn: `${config.sns.mailroomPrefix}endpointSuccess`,
          },
        },
      ],
    };

    // Run controller with mocked event
    const result = await handler(event);

    // Verify that function returned an error
    expect(result.statusCode).toBe(500);

    // Verify there was 1 request (1 real slack error)
    expect(mockRequests.length).toBe(1);

    // Verify that the SNS trigger was to the slack error channel
    expect(JSON.parse(mockRequests[0].Message).slack.channel).toBe(`#${config.slack.errorChannel}`);

    // Verify title link is correct in the slack error
    expect(JSON.parse(mockRequests[0].Message).slack.attachments[0].title_link).toBe(
      `${config.mailRoomURL}/leads/${input.lead_id}/${input.lead_version}`
    );
  });
});
