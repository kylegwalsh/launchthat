<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use GuzzleHttp\Client;
use GuzzleHttp\RequestOptions;
use GuzzleHttp\Exception\RequestException;

class AuthController extends AbstractController
{
    /**
     * Function to handle a login using a google auth code (proxies it to homebase)
     */
    public function google(Request $request)
    {
        try {
            // Extract the auth code from the body
            $content = $request->getContent();
            $content = json_decode($content, true);

            // Initialize HTTP client
            $client = new Client();

            // Endpoint for homebase auth
            $url = $_SERVER['HOMEBASE_API'].'/auth/';

            // Attach the auth code to the homebase request
            $body = array(
                // Include the auth code
                'code' => isset($content['code']) ? $content['code'] : '',
                // Redirect URI from app
                'redirectURI' => isset($content['redirectURI']) ? $content['redirectURI'] : ''
            );

            // Send details to homebase auth
            $homebase_response = $client->request('POST', $url, [
                RequestOptions::JSON => $body
            ]);

            // Check homebase response status (return error if received error)
            $status = $homebase_response->getStatusCode();
            if ($status < 200 || $status > 299) {
                $response = new JsonResponse();
                $response->setStatusCode($status);
                return $response;
            }

            // Extract the response data
            $result = (string) $homebase_response->getBody();
            $data = json_decode($result, true);

            // Check whether the user has the appropriate role for the app
            if (!in_array('ROLE_PAIDPAL', $data['roles'])) {
                $response = new JsonResponse();
                $response->setStatusCode(403);
                return $response;
            }

            // Send response with user data
            $response = new JsonResponse();
            $response->setStatusCode(200);
            $response->setData($data);
            return $response;
        }
        // Catch any errors and print them out
        catch (RequestException $e) {
            // Format response
            $body = array(
                'error' => $e->getMessage()
            );

            // Send response with user data
            $response = new JsonResponse();
            $response->setStatusCode(500);
            $response->setData($body);
            return $response;
        }
    }
}
