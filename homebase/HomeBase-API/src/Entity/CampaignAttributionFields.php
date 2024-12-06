<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Annotation\ApiProperty;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Core\Serializer\Filter\PropertyFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\OrderFilter;

use Doctrine\ORM\Mapping as ORM;

/**
 * CampaignAttributionFields
 *
 * @ApiResource(attributes={"pagination_enabled"=false})
 * @ApiFilter(SearchFilter::class)
 * @ApiFilter(PropertyFilter::class)
 * @ApiFilter(OrderFilter::class)
 * @ORM\Table(name="campaign_attribution_fields", indexes={@ORM\Index(name="campaignAttribution_campaignAttributionFields", columns={"campaign_attribution_id"}), @ORM\Index(name="routeField_campaignAttributionField", columns={"route_field_id"})})
 * @ORM\Entity
 * @ORM\HasLifecycleCallbacks()
 */
class CampaignAttributionFields
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
     * @var string|null
     *
     * @ORM\Column(name="value", type="string", length=255, nullable=true)
     */
    private $value;

    /**
     * @var \CampaignAttribution
     *
     * @ORM\ManyToOne(targetEntity="CampaignAttribution")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="campaign_attribution_id", referencedColumnName="id")
     * })
     * @ApiProperty(
     *     attributes={
     *         "swagger_context"={"type"="integer"}
     *     }
     * )
     */
    private $campaignAttributionId;

    /**
     * @var \RouteFields
     *
     * @ORM\ManyToOne(targetEntity="RouteFields")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="route_field_id", referencedColumnName="id", onDelete="CASCADE")
     * })
     * @ApiProperty(
     *     attributes={
     *         "swagger_context"={"type"="integer"}
     *     }
     * )
     */
    private $routeFieldId;

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

    public function getValue(): ?string
    {
        return $this->value;
    }

    public function setValue(?string $value): self
    {
        $this->value = $value;

        return $this;
    }

    public function getCampaignAttributionId(): ?CampaignAttribution
    {
        return $this->campaignAttributionId;
    }

    public function setCampaignAttributionId(?CampaignAttribution $campaignAttributionId): self
    {
        $this->campaignAttributionId = $campaignAttributionId;

        return $this;
    }


    public function getRouteFieldId(): ?RouteFields
    {
        return $this->routeFieldId;
    }

    public function setRouteFieldId(?RouteFields $routeFieldId): self
    {
        $this->routeFieldId = $routeFieldId;

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
