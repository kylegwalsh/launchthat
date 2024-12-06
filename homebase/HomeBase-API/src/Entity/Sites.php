<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Annotation\ApiResource;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Core\Serializer\Filter\PropertyFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\OrderFilter;


/**
 * Sites
 * @ApiResource(attributes={"pagination_enabled"=false})
 * @ApiFilter(SearchFilter::class)
 * @ApiFilter(PropertyFilter::class)
 * @ApiFilter(OrderFilter::class)
 * @ORM\Table(name="sites")
 * @ORM\Entity
 * @ORM\HasLifecycleCallbacks()
 */
class Sites
{
    /**
     * @var int
     *
     * @ORM\Column(name="id", type="integer", nullable=false, options={"unsigned"=true})
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="created_at", type="datetime", nullable=false)
     */
    private $createdAt;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="updated_at", type="datetime", nullable=false)
     */
    private $updatedAt;

    /**
     * @var string
     *
     * @ORM\Column(name="name", type="string", length=255, nullable=false)
     */
    private $name = '';

    /**
     * @var string|null
     *
     * @ORM\Column(name="lead_router", type="string", length=255, nullable=true)
     */
    private $leadRouter;

    /**
     * @var bool
     *
     * @ORM\Column(name="active", type="boolean", nullable=false)
     */
    private $active = '0';

    /**
     * @var string
     *
     * @ORM\Column(name="domain", type="string", length=255, nullable=false)
     */
    private $domain = '';

    /**
     * @var string|null
     *
     * @ORM\Column(name="deployment_email", type="string", length=255, nullable=true)
     */
    private $deploymentEmail;

    /**
     * @var string|null
     *
     * @ORM\Column(name="deployment_slack", type="string", length=255, nullable=true)
     */
    private $deploymentSlack;

    /**
     * @var string|null
     *
     * @ORM\Column(name="webmaster_email", type="string", length=255, nullable=true)
     */
    private $webmasterEmail;

    /**
     * @var string|null
     *
     * @ORM\Column(name="ua_id", type="string", length=255, nullable=true)
     */
    private $uaId;

    /**
     * @var string|null
     *
     * @ORM\Column(name="aw_id", type="string", length=255, nullable=true)
     */
    private $awId;

    /**
     * @var string|null
     *
     * @ORM\Column(name="cloudflare_zone", type="string", length=255, nullable=true)
     */
    private $cloudflareZone;

    /**
     * @var string|null
     *
     * @ORM\Column(name="app_key", type="string", length=255, nullable=true, unique=true)
     */
    private $appKey;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getCreatedAt(): ?\DateTimeInterface
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeInterface $createdAt): self
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    public function getUpdatedAt(): ?\DateTimeInterface
    {
        return $this->updatedAt;
    }

    public function setUpdatedAt(\DateTimeInterface $updatedAt): self
    {
        $this->updatedAt = $updatedAt;

        return $this;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    public function getLeadRouter(): ?string
    {
        return $this->leadRouter;
    }

    public function setLeadRouter(?string $leadRouter): self
    {
        $this->leadRouter = $leadRouter;

        return $this;
    }

    public function getActive(): ?bool
    {
        return $this->active;
    }

    public function setActive(bool $active): self
    {
        $this->active = $active;

        return $this;
    }

    public function getDomain(): ?string
    {
        return $this->domain;
    }

    public function setDomain(string $domain): self
    {
        $this->domain = $domain;

        return $this;
    }

    public function getDeploymentEmail(): ?string
    {
        return $this->deploymentEmail;
    }

    public function setDeploymentEmail(?string $deploymentEmail): self
    {
        $this->deploymentEmail = $deploymentEmail;

        return $this;
    }

    public function getDeploymentSlack(): ?string
    {
        return $this->deploymentSlack;
    }

    public function setDeploymentSlack(?string $deploymentSlack): self
    {
        $this->deploymentSlack = $deploymentSlack;

        return $this;
    }

    public function getWebmasterEmail(): ?string
    {
        return $this->webmasterEmail;
    }

    public function setWebmasterEmail(?string $webmasterEmail): self
    {
        $this->webmasterEmail = $webmasterEmail;

        return $this;
    }

    public function getUaId(): ?string
    {
        return $this->uaId;
    }

    public function setUaId(?string $uaId): self
    {
        $this->uaId = $uaId;

        return $this;
    }

    public function getAwId(): ?string
    {
        return $this->awId;
    }

    public function setAwId(?string $awId): self
    {
        $this->awId = $awId;

        return $this;
    }

    public function getCloudflareZone(): ?string
    {
        return $this->cloudflareZone;
    }

    public function setCloudflareZone(?string $cloudflareZone): self
    {
        $this->cloudflareZone = $cloudflareZone;

        return $this;
    }

    public function getAppKey(): ?string
    {
        return $this->appKey;
    }

    /**
     * @ORM\PrePersist
     */
    public function setCreatedAtValue()
    {
        $this->createdAt = new \DateTime();
        $this->updatedAt = new \DateTime();

        $appKey = random_int(100000000000000, 999999999999999);
        $this->appKey = $appKey;
    }

    /**
     * @ORM\PreUpdate
     */
    public function setUpdatedAtValue()
    {
        $this->updatedAt = new \DateTime();
    }
}
