<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\OrderFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Core\Serializer\Filter\PropertyFilter;
use Doctrine\ORM\Mapping as ORM;

/**
 * Leads
 *
 * @ApiResource()
 * @ApiFilter(SearchFilter::class)
 * @ApiFilter(PropertyFilter::class)
 * @ApiFilter(OrderFilter::class)
 * @ORM\Table(name="leads")
 * @ORM\Entity
 * @ORM\HasLifecycleCallbacks()
 */
class Leads
{
    /**
     * @var int
     *
     * @ORM\Column(name="id", type="integer", nullable=false, options={"unsigned"=true})
     * @ORM\Id
     */
    private $id;

    /**
     * @var int
     *
     * @ORM\Column(name="version", type="integer", nullable=false, options={"unsigned"=true, "default": 1})
     * @ORM\Id
     */
    private $version;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="created_at", type="datetime", nullable=false, options={"default": "CURRENT_TIMESTAMP"})
     */
    private $createdAt;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="updated_at", type="datetime", nullable=false, options={"default": "CURRENT_TIMESTAMP"})
     */
    private $updatedAt;

    /**
     * @var int
     *
     * @ORM\Column(name="vertical_id", type="integer", nullable=false, options={"unsigned"=true})
     */
    private $verticalId;

    /**
     * @var int
     *
     * @ORM\Column(name="site_id", type="integer", nullable=false, options={"unsigned"=true})
     */
    private $siteId;

    /**
     * @var int
     *
     * @ORM\Column(name="route_id", type="integer", nullable=false, options={"unsigned"=true})
     */
    private $routeId;

    /**
     * @var string
     *
     * @ORM\Column(name="channel", type="string", length=100, nullable=false)
     */
    private $channel = 'unknown';

    /**
     * @var string
     *
     * @ORM\Column(name="delivery_status", type="string", length=100, nullable=false)
     */
    private $deliveryStatus = 'unsent';

    /**
     * @var json|null
     *
     * @ORM\Column(name="fields", type="json", nullable=true)
     */
    private $fields;

    /**
     * @var int
     *
     * @ORM\Column(name="rule_version", type="integer", nullable=false, options={"unsigned"=true, "default": 1})
     */
    private $ruleVersion;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setId(): ?int
    {
        $this->id = $id;

        return $this;
    }

    public function getVersion(): ?int
    {
        return $this->version;
    }

    public function setVersion(): ?int
    {
        $this->version = $version;

        return $this;
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

    public function getVerticalId(): ?int
    {
        return $this->verticalId;
    }

    public function setVerticalId(int $verticalId): self
    {
        $this->verticalId = $verticalId;

        return $this;
    }

    public function getSiteId(): ?int
    {
        return $this->siteId;
    }

    public function setSiteId(int $siteId): self
    {
        $this->siteId = $siteId;

        return $this;
    }

    public function getRouteId(): ?int
    {
        return $this->routeId;
    }

    public function setRouteId(int $routeId): self
    {
        $this->routeId = $routeId;

        return $this;
    }

    public function getChannel(): ?string
    {
        return $this->channel;
    }

    public function setChannel(string $channel): self
    {
        $this->channel = $channel;

        return $this;
    }

    public function getDeliveryStatus(): ?string
    {
        return $this->deliveryStatus;
    }

    public function setDeliveryStatus(string $deliveryStatus): self
    {
        $this->deliveryStatus = $deliveryStatus;

        return $this;
    }

    public function getFields(): ?array
    {
        return $this->fields;
    }

    public function setFields(?string $fields): self
    {
        $this->fields = $fields;

        return $this;
    }

    public function getRuleVersion(): ?int
    {
        return $this->ruleVersion;
    }

    public function setRuleVersion(int $ruleVersion): self
    {
        $this->ruleVersion = $ruleVersion;

        return $this;
    }

    /**
     * @ORM\PrePersist
     */
    public function setCreatedAtValue()
    {
        $this->createdAt = new \DateTime();
        $this->updatedAt = new \DateTime();
    }

    /**
     * @ORM\PreUpdate
     */
    public function setUpdatedAtValue()
    {
        $this->updatedAt = new \DateTime();
    }
}
