<?php

namespace App\Security;

use Symfony\Component\Security\Core\User\UserInterface;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;


class PaidPalUser implements UserInterface
{
    private $googleId;

    private $roles = [];

    public function getGoogleId(): ?string
    {
        return $this->googleId;
    }

    public function setGoogleId(string $googleId): self
    {
        $this->googleId = $googleId;

        return $this;
    }

    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    public function getUsername(): string
    {
        return (string) $this->googleId;
    }

    /**
     * Validating User.
     *
     * @see UserInterface
     */
    public function validateUser($token)
    {
        $baseurl = $_SERVER['HOMEBASE_API'];
        $url = $baseurl.'/api/verify';

        $client = new Client(['headers' => ['accept' => 'application/json', 'X-AUTH-TOKEN' => $token]]);
        try {
            $response = $client->get($url);
            $result = (string) $response->getBody();
        } catch (RequestException $e) {
            return;
        }

        if ($result) {
            $vals = json_decode($result, true);
            $this->setGoogleId((string) $vals['id']);
            $this->setRoles($vals['roles']);

            return $this;
        }
        return;
    }


    /**
     * @see UserInterface
     */
    public function getRoles(): array
    {
        $roles = $this->roles;
        // guarantee every user at least has ROLE_USER
        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    public function setRoles(array $roles): self
    {
        $this->roles = $roles;

        return $this;
    }

    /**
     * @see UserInterface
     */
    public function getPassword()
    {
        // not needed for apps that do not check user passwords
    }

    /**
     * @see UserInterface
     */
    public function getSalt()
    {
        // not needed for apps that do not check user passwords
    }

    /**
     * @see UserInterface
     */
    public function eraseCredentials()
    {
        // If you store any temporary, sensitive data on the user, clear it here
        // $this->plainPassword = null;
    }
}
