<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Annotation\ApiProperty;
use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Core\Serializer\Filter\PropertyFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\OrderFilter;
use Doctrine\ORM\Mapping as ORM;

/**
 * CampaignAttribution
 *
 * @ApiResource(attributes={"pagination_enabled"=false})
 * @ApiFilter(SearchFilter::class)
 * @ApiFilter(PropertyFilter::class)
 * @ApiFilter(OrderFilter::class)
 * @ORM\Table(name="campaign_attribution", indexes={@ORM\Index(name="route_campaignAttribution", columns={"route_id"}), @ORM\Index(name="campaign_campaignAttribution", columns={"campaign_id"})})
 * @ORM\Entity
 * @ORM\HasLifecycleCallbacks()
 */
class CampaignAttribution
{
    /**
     * @var int
     *
     * @ORM\Column(name="id", type="integer", nullable=false, options={"unsigned"=true})
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="IDENTITY")
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
     * @var \Campaigns
     *
     * @ORM\ManyToOne(targetEntity="Campaigns")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="campaign_id", referencedColumnName="id", onDelete="CASCADE")
     * })
     * @ApiProperty(
     *     attributes={
     *         "swagger_context"={"type"="integer"}
     *     }
     * )
     */
    private $campaignId;


    /**
     * @var \Routes
     *
     * @ORM\ManyToOne(targetEntity="Routes")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="route_id", referencedColumnName="id")
     * })
     * @ApiProperty(
     *     attributes={
     *         "swagger_context"={"type"="integer"}
     *     }
     * )
     */
    private $routeId;

    /**
     * @var bool
     *
     * @ORM\Column(name="is_paid", type="boolean", nullable=false)
     */
    private $isPaid = '0';


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

    public function getRouteId(): ?Routes
    {
        return $this->routeId;
    }

    public function setRouteId(?Routes $routeId): self
    {
        $this->routeId = $routeId;

        return $this;
    }

    public function getCampaignId(): ?Campaigns
    {
        return $this->campaignId;
    }

    public function setCampaignId(?Campaigns $campaignId): self
    {
        $this->campaignId = $campaignId;

        return $this;
    }

    public function getIsPaid(): ?bool
    {
        return $this->isPaid;
    }

    public function setIsPaid(bool $isPaid): self
    {
        $this->isPaid = $isPaid;

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
