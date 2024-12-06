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
 * ResponseRecords
 *
 * @ApiResource(attributes={"pagination_enabled"=false})
 * @ORM\Table(name="response_records", indexes={@ORM\Index(name="endpoints_responseRecords", columns={"endpoint_id"}), @ORM\Index(name="leads_responseRecords", columns={"lead_id", "lead_version"})})
 * @ApiFilter(SearchFilter::class)
 * @ApiFilter(PropertyFilter::class)
 * @ApiFilter(OrderFilter::class)
 * @ORM\Entity
 * @ORM\HasLifecycleCallbacks()
 */
class ResponseRecords
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
     * @var int|null
     *
     * @ORM\Column(name="status_code", type="integer", nullable=true, options={"default"="-1"})
     */
    private $statusCode = '-1';

    /**
     * @var string|null
     *
     * @ORM\Column(name="reason_phrase", type="string", length=255, nullable=true)
     */
    private $reasonPhrase;

    /**
     * @var json|null
     *
     * @ORM\Column(name="body", type="json", nullable=true)
     */
    private $body;

    /**
     * @var \Endpoints
     *
     * @ORM\ManyToOne(targetEntity="Endpoints")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="endpoint_id", referencedColumnName="id")
     * })
     * @ApiProperty(
     *     attributes={
     *         "swagger_context"={"type"="integer"}
     *     }
     * )
     */
    private $endpointId;

    /**
     * @var int
     *
     * @ORM\Column(name="lead_id", type="integer", nullable=false, options={"unsigned"=true})
     */
    private $leadId;

   /**
     * @var int
     *
     * @ORM\Column(name="lead_version", type="integer", nullable=false, options={"unsigned"=true, "default": 1})
     */
    private $leadVersion;

    /**
     * @var \Leads
     * 
     * @ORM\ManyToOne(targetEntity="Leads")
     * @ORM\JoinColumns({
     *     @ORM\JoinColumn(name="lead_id", referencedColumnName="id", onDelete="CASCADE"),
     *     @ORM\JoinColumn(name="lead_version", referencedColumnName="version", onDelete="CASCADE")
     * })
     **/
    private $lead;

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

    public function getStatusCode(): ?int
    {
        return $this->statusCode;
    }

    public function setStatusCode(?int $statusCode): self
    {
        $this->statusCode = $statusCode;

        return $this;
    }

    public function getReasonPhrase(): ?string
    {
        return $this->reasonPhrase;
    }

    public function setReasonPhrase(?string $reasonPhrase): self
    {
        $this->reasonPhrase = $reasonPhrase;

        return $this;
    }

    public function getBody(): ?array
    {
        return $this->body;
    }

    public function setBody(?string $body): self
    {
        $this->body = $body;

        return $this;
    }

    public function getEndpointId(): ?Endpoints
    {
        return $this->endpointId;
    }

    public function setEndpointId(?Endpoints $endpoint): self
    {
        $this->endpointId = $endpointId;

        return $this;
    }

    public function getLeadId(): ?int
    {
        return $this->leadId;
    }

    public function setLeadId(?int $leadId): self
    {
        $this->leadId = $leadId;

        return $this;
    }

    public function getLeadVersion(): ?int
    {
        return $this->leadVersion;
    }

    public function setLeadVersion(?int $leadVersion): self
    {
        $this->leadVersion = $leadVersion;

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
