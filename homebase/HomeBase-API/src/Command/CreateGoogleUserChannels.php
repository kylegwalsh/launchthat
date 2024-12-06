<?php

namespace App\Command;

use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use GuzzleHttp\Client;
use GuzzleHttp\RequestOptions;
use GuzzleHttp\Exception\RequestException;

class CreateGoogleUserChannels extends Command
{
    /**
     * Google client
     */
    private $client;

    /**
     * The name of the command
     * Invoke with - php bin/console app:create-channels
     */
    protected static $defaultName = 'app:create-channels';

    /**
     * Initialize with google client
     */
    public function __construct(\Google_Client $client) {
        $this->client = $client;

        parent::__construct();
    }

    /**
     * Configures help information for this command
     */
    protected function configure()
    {
        $this
        // the short description shown while running "php bin/console list"
        ->setDescription('Creates homebase google user events channels.')
        // the full command description shown when running the command with
        // the "--help" option
        ->setHelp('Used to create google listening channels that send
        events relating to user creation / deletion to homebase. Should
        be run by CRON.');
    }

    /**
     * Executes the command and sets up the google channels
     */
    protected function execute(InputInterface $input, OutputInterface $output)
    {
        // Configure client with client secret file
        $rootPath = $this->getApplication()->getKernel()->getContainer()->getParameter('kernel.project_dir');
        $this->client->setAuthConfig($rootPath . '/google_client_secrets/admin_secret.json');

        // Get a new access token
        $response = $this->client->refreshToken($_SERVER['ADMIN_REFRESH_TOKEN']);
        $accessToken = $response['access_token'];
        
        // Calculate when the channel should expire (1 day after creation, minus 5 minute buffer)
        $expirationTime = (time() + (24 * 60 * 60) - 60 * 5) * 1000;

        // Try to initialize channels
        try {
            // Initialize HTTP client
            $client = new Client();

            // Endpoint for deletion channel trigger
            $url = 'https://www.googleapis.com/admin/directory/v1/users/watch?domain=launchthat.com&event=delete';
            
            // Generate auth header using access token
            $headers = array(
                'Authorization' => 'Bearer ' . $accessToken
            );

            // Form request body (deletion channel)
            $body = array(
                // Channel name
                'id' => 'deleteUserChannel',
                // Type of handler
                'type' => 'web_hook',
                // Endpoint to send events to
                'address' => 'https://homebase-api.launchthat.com/it/delete/',
                // Token to send to the endpoint above (googel_webhook_user JWT)
                'token' => 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJnb29nbGVJZCI6Imdvb2dsZV93ZWJfaG9vayJ9.EQyHiPpvhLwEYlIJu69UD9TmYv9VMm52UeG8EDZzbHU',
                // When the channel expires
                'expiration' => $expirationTime
            );

            // Initialize delete channel with request
            $response = $client->request('POST', $url, [
                RequestOptions::JSON => $body,
                'headers' => $headers
            ]);
            
            // Verify the request was successful
            $output->writeln('Successfully created delete channel:');
            echo $response->getBody();
            $output->writeln('');

            // Update details for user creation channel

            // Endpoint for deletion channel trigger
            $url = 'https://www.googleapis.com/admin/directory/v1/users/watch?domain=launchthat.com&event=add';
            
            // Update channel name
            $body['id'] = 'addUserChannel';
            $body['address'] = 'https://homebase-api.launchthat.com/it/create/';

            // Initialize creation channel with request
            $response = $client->request('POST', $url, [
                RequestOptions::JSON => $body,
                'headers' => $headers
            ]);

            // Verify the request was successful
            $output->writeln('Successfully created add channel:');
            echo $response->getBody();
            $output->writeln('');
        } 
        // Catch any errors and print them out
        catch (RequestException $e) {
            $output->writeLn('Exception caught:');
            $output->writeln($e->getMessage());
            $output->writeln('');
        }
    }
}
