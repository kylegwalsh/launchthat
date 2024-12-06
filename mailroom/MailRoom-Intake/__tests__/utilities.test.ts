// *** HANDLER ***

// Import the utilities functions for testing
import { Format, Notification, Storage } from '../utilities';
import { getConfig } from '../config';

// Initialize variables
let config;

// *** MOCKS ***

// Disable console logs (they clutter up test results)
// If you are trying to debug unit tests, just comment it out
console.log = jest.fn();

/**
 * Store mocked requests for testing
 */
let mockRequests: any[] = [];

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

    // Store request in our requests array
    mockRequests.push({ url, params });

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
        return 'data';
      }
    };

  };
});

// *** TESTS ***

// Test for format utility
describe('Utilities - Format Tests', () => {

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
  test('Title Case', () => {
    // Input for utility
    let input = 'little text';

    // Expected result to test against
    let expectedResult = 'Little Text';

    // Run function
    let result = Format.titleCase(input);

    // Verify that the result is correct
    expect(result).toBe(expectedResult);

    // Input for utility (7:00 AM)
    input = 'underscore_text';

    // Expected result to test against
    expectedResult = 'Underscore Text';

    // Run function to format input
    result = Format.titleCase(input);

    // Verify that the result is correct
    expect(result).toBe(expectedResult);
  });

  // *** TEST 4 ***
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
        test_id: '1'
      }
    };

    // Expected result to test against
    const expectedResult = {
      first_name: 'Kyle',
      last_name: 'Walsh',
      phone_number: '1234567890',
      luid: 'PT000000000000012',
      test_id: '1'
    };

    // Run function
    const result = Format.flattenObject(input);

    // Verify that the result is correct
    expect(result).toEqual(expectedResult);
  });

  // *** TEST 5 ***
  test('Is Empty', () => {
    // Input for utility
    let input = {};

    // Run function
    const result = Format.isEmpty(input);

    // Input for utility
    input = {
      test: 1
    };

    // Run function
    const result2 = Format.isEmpty(input);

    // Verify that the result is correct
    expect(result).toEqual(true);
    expect(result2).toEqual(false);
  });

  // *** TEST 6 ***
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

  // Run before any test starts (get config)
  beforeAll(async() => {
    process.env.stage = 'dev';
    config = await getConfig();
  });

  // *** TEST 1 ***
  test('Generate Slack', async() => {
    // Final resulting fields that should be generated
    const finalFields = {
      username: 'Test Name',
      icon_emoji: config.slack.emoji,
      channel: config.slack.errorChannel,
      attachments: [{
        fallback: 'There was an error',
        title: 'Error :x:',
        color: 'danger',
        text: 'There was an error',
      }]
    };

    const slack = await Notification.generateSlack(
      finalFields.channel, 
      finalFields.attachments[0].color, 
      finalFields.attachments[0].text, 
      finalFields.attachments[0].title
    );

    // Verify slack channel is correct
    expect(slack.channel).toBe(`#${finalFields.channel}`);

    // Verify title is correct
    expect(slack.attachments[0].title).toEqual(finalFields.attachments[0].title);

    // Verify attachment message is correct
    expect(slack.attachments[0].text).toEqual(finalFields.attachments[0].text);
  });

});

// Test for storage utility
describe('Utilities - Storage Tests', () => {

  // Run before any test starts (get config)
  beforeAll(async() => {
    process.env.stage = 'dev';
    config = await getConfig();
  });

  // Run before any test starts (get config)
  beforeEach(async() => {
    // Reset our mockRequests array
    mockRequests = [];
  });

  // *** TEST 1 ***
  test('Store JSON', async() => {
    // Final resulting fields that should be generated
    const options = {
      content: {
        test: true
      },
      bucket: 'bucket',
      fileName: 'file.json',
      path: 'folder',
    };

    // Run the store json function
    await Storage.storeJSON(options);

    // Verify there is 1 requests (1 external API request)
    expect(mockRequests.length).toBe(1);

    // Verify URL is correct
    expect(mockRequests[0].url).toBe(config.storage.s3.endpoint);

    // Verify the bucket is correct
    expect(JSON.parse(mockRequests[0].params.body).bucket).toBe(options.bucket);
    // Verify the fileName is correct
    expect(JSON.parse(mockRequests[0].params.body).fileName).toBe(options.fileName);
    // Verify the path is correct
    expect(JSON.parse(mockRequests[0].params.body).path).toBe(options.path);
    // Verify the content is correct
    expect(JSON.parse(JSON.parse(mockRequests[0].params.body).content).test).toBe(true);
  });

  // *** TEST 2 ***
  test('Retrieve JSON', async() => {
    // Final resulting fields that should be generated
    const options = {
      bucket: 'bucket',
      fileName: 'file.json',
      path: 'folder',
    };

    // Run the store json function
    const result = await Storage.getJSON(options);

    // Verify there is 1 requests (1 external API request)
    expect(mockRequests.length).toBe(1);

    // Verify URL is correct
    expect(mockRequests[0].url).toBe(config.storage.s3.endpoint + 
      `?bucket=${options.bucket}&fileName=${options.fileName}&path=${options.path}`);

    // Verify the response is formatted correctly
    expect(result.ok).toBe(true);
  });

});