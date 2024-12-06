# Mailroom-Core

This is the backend lead routing system that receives leads, sends them to endpoints, and tracks responses from those endpoints.

The data types used by the system are managed by both [homebase](https://homebase.launchthat.com) and [mailroom](https://mailroom.launchthat.com).

The system is based on serverlessJS (see the [serverless docs](https://serverless.com/)).

## File Structure

The important parts of the file structure are as follows:

```
  ├── __tests__       # This is where unit tests live
  ├── database        # Contains the function that connects to the database
  ├── functions       # Contains the actual functions that are invoked when the system runs
  ├── providers       # Contains the endpoint provider (abstracts the functionality for firing endpoints for the `fireEndpoint` function)
  ├── templates       # Contains HTML templates used for email notifications
  ├── utilities       # Contains helper functions used in various areas of the app
  ├── serverless.yml  # Contains the overall configuration for deploying the application to AWS
  └── config.ts       # Contains basic configuration details, like api endpoints and credentials
```

## Functionality

A visual diagram of the app functionality can be found [here](https://drive.google.com/drive/folders/1fsS2iiKepufQmPsGvmjEsrLrpN5u9eOh).

Here is a very high level overview of how the logic of the system works:

1. Leads hit PipeThat, get processed and are then sent to Mailroom for delivery
2. When a lead enters Mailroom, it triggers `controller.js`, which sends internal notifications and determines which endpoints are active based on the route attached to the lead. It then triggers `fireEndpoint.js` for each active endpoint
3. `fireEndpoint.js` fires the actual endpoint (either email or HTTP) and then forwards the response to `handleResponse.js`
4. `handleResponse.js` records the response from the endpoint in the database

## Deploying

Before deploying, make sure to run `npm test` to make sure the unit tests pass. Remember, this is a mission critical system!

To deploy the development version of the application, run `sls deploy`.

To deploy the production version of the application, run `sls deploy -s prod`.
