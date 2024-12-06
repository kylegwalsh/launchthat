# Homebase API

An API built on top of PHP's [API Platform](https://api-platform.com/docs/) that provides access to Homebase's data.

## Managing LT Users

To manage the LT user's in homebase database whenever a user is added or deleted from LT's google system, you must set up a CRON that invokes the channel creation command.

This is necessary because google channels expire within 2 days. We can circumvent the issue by just reestablishing it every two days.

The command that does this can be found in `src/Command/CreateGoogleUserChannels`. You only need to worry about this if you are going to update the function.

To start the CRON if you ever move the server or it happens to break, just run the following command.

```
bash create_google_cron.sh
```