<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use \Firebase\JWT\JWT;
use App\Entity\User;

class AuthController extends AbstractController
{
    /**
     * Function to handle a login using a google auth code
     */
    public function google(Request $request, \Google_Client $client)
    {
        // Extract the auth code from the body
        $content = $request->getContent();
        $content = json_decode($content, true);

        // See if code was passed in
        if (isset($content['code']) && '' !== $content['code'] && isset($content['redirectURI']) && '' !== $content['redirectURI']) {
            $code = $content['code'];
            $redirectURI = $content['redirectURI'];
        } else {
            // If code is not defined, return an error
            $response = new JsonResponse();
            $response->setStatusCode(400);
            return $response;
        }

        // Configure client with client secret file
        $rootPath = $this->getParameter('kernel.project_dir');
        $client->setAuthConfig($rootPath . '/google_client_secrets/app_secret.json');
        
        // Configure redirect URI to match origin of request (sent in body)
        $client->setRedirectUri($redirectURI);

        // Retrieve details from google (includes access token, id token, refresh token)
        $details = $client->fetchAccessTokenWithAuthCode($code);

        // If the response from google does not include an ID token, return an error
        if (!isset($details['id_token'])) {
            $response = new JsonResponse();
            $response->setStatusCode(500);
            return $response;
        }

        // Get user details from
        $user_info = $client->verifyIdToken($details['id_token']);

        // If the user trying to log in does not belong to launchthat, return an error
        if (isset($user_info['hd']) && $user_info['hd'] !== 'launchthat.com') {
            $response = new JsonResponse();
            $response->setStatusCode(401);
            return $response;
        }

        // Initialize doctrine entity manager to update DB
        $em = $this->getDoctrine()->getManager();

        // Retrieve the user from the db
        $user = $this->getDoctrine()->getRepository(User::class)
            ->findOneBy(array('googleId' => $user_info['sub']));

        // If the user does not exist in the database yet, create them
        if (!$user) {
            $user = new User();
            $user->setGoogleId($user_info['sub']);
            $user->setName($user_info['given_name'].' '.$user_info['family_name']);
            $user->setEmail($user_info['email']);
            
            // Make note that we need to create user in DB
            $em->persist($user);

            // Assign user's role so it can be used in frontend
            $body['roles'] = array('ROLE_USER');
        } else {
            // If the user already exists, grab their existing role
            $body['roles'] = $user->getRoles();
        }

        // Executes any necessary queries (update / create user)
        $em->flush();

        // Define response body with the user data
        $body['firstName'] = $user_info['given_name'];
        $body['lastName'] = $user_info['family_name'];
        $body['picture'] = $user_info['picture'];
        $body['email'] = $user_info['email'];

        // Encrypt the user's google id to make a token to be used in subsequent requests
        $key = $_SERVER['APP_SECRET'];
        $token = array(
            'googleId' => $user_info['sub'],
        );
        $body['token'] = JWT::encode($token, $key);

        // Send response with user data
        $response = new JsonResponse();
        $response->setStatusCode(200);
        $response->setData($body);
        return $response;
    }


    public function verify(Request $request)
    {
        $token = $request->headers->get('X-AUTH-TOKEN');
        $em = $this->getDoctrine()->getManager();

        $key = $_SERVER['APP_SECRET'];
        $apiToken = JWT::decode($token, $key, array('HS256'));
        if (!is_string($apiToken)) {
            $apiToken = (array) $apiToken;
            $apiToken = (string) $apiToken['googleId'];
        }

        // if a User object, checkCredentials() is called
        $validUser = $em->getRepository(User::class)
            ->findOneBy(['googleId' => $apiToken]);

        $userInfo = null;

        if ($validUser) {
            $userInfo['roles'] = $validUser->getRoles();
            $userInfo['id'] = $validUser->getId();
        }

        // Send response with user data
        $response = new JsonResponse();
        $response->setStatusCode(200);
        $response->setData($userInfo);
        return $response;
    }
}
