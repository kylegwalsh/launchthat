<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use App\Entity\User;

class ITController extends AbstractController
{
    /**
     * Handles Google user creation trigger (add user to homebase)
     */
    public function create(Request $request)
    {
        // Parse the request body
        $content = $request->getContent();
        $content = json_decode($content, true);

        // Initialize doctrine entity manager to update DB
        $em = $this->getDoctrine()->getManager();

        // Create the new user with the google request body
        $user = new User();
        $user->setGoogleId($content['id']);
        $user->setEmail($content['primaryEmail']);
            
        // Make note that we need to create user in DB
        $em->persist($user);

        // Executes any necessary queries (update / create user)
        $em->flush();

        // Send response
        $response = new JsonResponse();
        $response->setStatusCode(200);
        return $response;
    }

    /**
     * Handles Google user deletion trigger (remove user from homebase)
     */
    public function delete(Request $request)
    {
        // Parse the request body
        $content = $request->getContent();
        $content = json_decode($content, true);

        $em = $this->getDoctrine()->getManager();

        // Find and remove the deleted user
        $user = $em->getRepository(User::class)
            ->findOneBy(['googleId' => $content['id']]);
        $em->remove($user);

        // Executes any necessary queries (update / create user)
        $em->flush();

        // Send response
        $response = new JsonResponse();
        $response->setStatusCode(200);
        return $response;
    }
}
