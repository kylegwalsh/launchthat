<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Annotation\ApiResource;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Core\Serializer\Filter\PropertyFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\OrderFilter;


/**
 * Verticals
 *
 * @ApiResource(attributes={"pagination_enabled"=false})
 * @ApiFilter(SearchFilter::class)
 * @ApiFilter(PropertyFilter::class)
 * @ApiFilter(OrderFilter::class)
 * @ORM\Table(name="verticals")
 * @ORM\Entity
 * @ORM\HasLifecycleCallbacks()
 */
class Verticals
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
     * @var string
     *
     * @ORM\Column(name="name", type="string", length=255, nullable=false)
     */
    private $name = '';

    /**
     * @var string
     *
     * @ORM\Column(name="lead_email", type="string", length=255, nullable=false)
     */
    private $leadEmail = '';

    /**
     * @var string
     *
     * @ORM\Column(name="lead_email_test", type="string", length=255, nullable=false)
     */
    private $leadEmailTest = '';

    /**
     * @var string
     *
     * @ORM\Column(name="lead_slack", type="string", length=255, nullable=false)
     */
    private $leadSlack = '';

    /**
     * @var string
     *
     * @ORM\Column(name="lead_slack_test", type="string", length=255, nullable=false)
     */
    private $leadSlackTest = '';

    /**
     * @var string
     *
     * @ORM\Column(name="description", type="string", length=510, nullable=false)
     */
    private $description = '';

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

    public function getLeadEmail(): ?string
    {
        return $this->leadEmail;
    }

    public function setLeadEmail(string $leadEmail): self
    {
        $this->leadEmail = $leadEmail;

        return $this;
    }

    public function getLeadEmailTest(): ?string
    {
        return $this->leadEmailTest;
    }

    public function setLeadEmailTest(string $leadEmailTest): self
    {
        $this->leadEmailTest = $leadEmailTest;

        return $this;
    }

    public function getLeadSlack(): ?string
    {
        return $this->leadSlack;
    }

    public function setLeadSlack(string $leadSlack): self
    {
        $this->leadSlack = $leadSlack;

        return $this;
    }

    public function getLeadSlackTest(): ?string
    {
        return $this->leadSlackTest;
    }

    public function setLeadSlackTest(string $leadSlackTest): self
    {
        $this->leadSlackTest = $leadSlackTest;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(string $description): self
    {
        $this->description = $description;

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
