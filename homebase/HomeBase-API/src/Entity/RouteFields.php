<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiFilter;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Annotation\ApiProperty;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Core\Serializer\Filter\PropertyFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\OrderFilter;


/**
 * RouteFields
 *
 * @ApiResource(attributes={"pagination_enabled"=false})
 * @ApiFilter(SearchFilter::class)
 * @ApiFilter(PropertyFilter::class)
 * @ApiFilter(OrderFilter::class)
 * @ORM\Table(name="route_fields", indexes={@ORM\Index(name="route_routeFIelds", columns={"route_id"}), @ORM\Index(name="field_routeFields", columns={"field_id"})})
 * @ORM\Entity
 * @ORM\HasLifecycleCallbacks()
 */
class RouteFields
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
     * @var \Fields
     *
     * @ORM\ManyToOne(targetEntity="Fields")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="field_id", referencedColumnName="id")
     * })
     * @ApiProperty(
     *     attributes={
     *         "swagger_context"={"type"="integer"}
     *     }
     * )
     */
    private $fieldId;

    /**
     * @var \Routes
     *
     * @ORM\ManyToOne(targetEntity="Routes")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="route_id", referencedColumnName="id", onDelete="CASCADE")
     * })
     * @ApiProperty(
     *     attributes={
     *         "swagger_context"={"type"="integer"}
     *     }
     * )
     */
    private $routeId;

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

    public function getFieldId(): ?Fields
    {
        return $this->fieldId;
    }

    public function setFieldId(?Fields $fieldId): self
    {
        $this->fieldId = $fieldId;

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
