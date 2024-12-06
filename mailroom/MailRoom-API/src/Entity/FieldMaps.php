<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Serializer\Filter\PropertyFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\BooleanFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\OrderFilter;
use Doctrine\ORM\Mapping as ORM;

/**
 * FieldMaps
 *
 * @ApiResource(attributes={"pagination_enabled"=false})
 * @ApiFilter(BooleanFilter::class, properties={"internalEmail"})
 * @ApiFilter(PropertyFilter::class)
 * @ApiFilter(SearchFilter::class)
 * @ApiFilter(OrderFilter::class)
 * @ORM\Table(name="field_maps")
 * @ORM\Entity
 * @ORM\HasLifecycleCallbacks()
 */
class FieldMaps
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
     * @var string
     *
     * @ORM\Column(name="name", type="string", length=255, nullable=false)
     */
    private $name = '';

    /**
     * @var bool
     *
     * @ORM\Column(name="internal_email", type="boolean", nullable=false)
     */
    private $internalEmail = '0';

    /**
     * @ORM\Column(name="field_map", type="json", nullable=true)
     */
    private $fieldMap;

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

    public function getInternalEmail(): ?bool
    {
        return $this->internalEmail;
    }

    public function setInternalEmail(bool $internalEmail): self
    {
        $this->internalEmail = $internalEmail;

        return $this;
    }

    /**
     * Get fieldMap
     *
     * @return string
     */
    public function getFieldMap()
    {
        return $this->fieldMap;
    }

    /**
     * Set fieldMap
     *
     * @param string $fieldMap
     *
     * @return RequestRecords
     */
    public function setFieldMap($fieldMap): self
    {
        $this->fieldMap = $fieldMap;

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
