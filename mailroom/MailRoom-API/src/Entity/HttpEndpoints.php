<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Annotation\ApiProperty;
use ApiPlatform\Core\Serializer\Filter\PropertyFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\OrderFilter;
use Doctrine\ORM\Mapping as ORM;

/**
 * HttpEndpoints
 *
 * @ApiResource(attributes={"pagination_enabled"=false})
 * @ApiFilter(PropertyFilter::class)
 * @ApiFilter(SearchFilter::class)
 * @ApiFilter(OrderFilter::class)
 * @ORM\Table(name="http_endpoints", indexes={@ORM\Index(name="fieldMaps_httpEndpoints", columns={"field_map_id"})})
 * @ORM\Entity
 * @ORM\HasLifecycleCallbacks()
 */
class HttpEndpoints
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
     * @ORM\Column(name="url", type="string", length=255, nullable=false)
     */
    private $url = '';

    /**
     * @ORM\Column(name="headers", type="json", nullable=true)
     */
    private $headers;

    /**
     * @var string
     *
     * @ORM\Column(name="method", type="string", length=255, nullable=false, options={"default"="POST"})
     */
    private $method = 'POST';

    /**
     * @var bool
     *
     * @ORM\Column(name="strip_blanks", type="boolean", nullable=false)
     */
    private $stripBlanks = '0';

    /**
     * @var \FieldMaps
     *
     * @ORM\ManyToOne(targetEntity="FieldMaps")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="field_map_id", referencedColumnName="id")
     * })
     * @ApiProperty(
     *     attributes={
     *         "swagger_context"={"type"="integer"}
     *     }
     * )
     */
    private $fieldMapId;

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

    public function getUrl(): ?string
    {
        return $this->url;
    }

    public function setUrl(string $url): self
    {
        $this->url = $url;

        return $this;
    }

    /**
     * Get headers
     *
     * @return string
     */
    public function getHeaders()
    {
        return $this->headers;
    }

    /**
     * Set headers
     *
     * @param string $headers
     *
     * @return HttpEndpoints
     */
    public function setHeaders($headers): self
    {
        $this->headers = $headers;

        return $this;
    }

    public function getMethod(): ?string
    {
        return $this->method;
    }

    public function setMethod(string $method): self
    {
        $this->method = $method;

        return $this;
    }

    public function getStripBlanks(): ?bool
    {
        return $this->stripBlanks;
    }

    public function setStripBlanks(bool $stripBlanks): self
    {
        $this->stripBlanks = $stripBlanks;

        return $this;
    }

    public function getFieldMapId(): ?FieldMaps
    {
        return $this->fieldMapId;
    }

    public function setFieldMapId(?FieldMaps $fieldMapId): self
    {
        $this->fieldMapId = $fieldMapId;

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
