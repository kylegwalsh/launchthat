<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\OrderFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Core\Serializer\Filter\PropertyFilter;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ApiResource()
 * @ApiFilter(SearchFilter::class)
 * @ApiFilter(PropertyFilter::class)
 * @ApiFilter(OrderFilter::class)
 * @ORM\Table(name="asbestos_leads")
 * @ORM\Entity(repositoryClass="App\Repository\AsbestosLeadsRepository")
 */
class AsbestosLeads
{
    /**
     * @ORM\Column(name="md_id", length=255, type="string")
     * @ORM\Id
     */
    private $mdId;

    /**
     * @ORM\Column(name="lead_id", length=255, type="string", nullable=true)
     */
    private $leadId;

    /**
     * @ORM\Column(type="datetime")
     */
    private $date;

    /**
     * @ORM\Column(name="campaign_id", type="string", length=255, nullable=true)
     */
    private $campaignId;

    /**
     * @ORM\Column(name="adgroup_id", type="string", length=255, nullable=true)
     */
    private $adgroupId;

    /**
     * @ORM\Column(name="keyword_id", type="string", length=255, nullable=true)
     */
    private $keywordId;

    /**
     * @ORM\Column(name="creative_id", type="string", length=255, nullable=true)
     */
    private $creativeId;

    /**
     * @ORM\Column(name="is_md", type="smallint", nullable=true)
     */
    private $isMd;

    /**
     * @ORM\Column(name="is_lead", type="smallint", nullable=true)
     */
    private $isLead;

    /**
     * @ORM\Column(name="is_meso_form_lead", type="smallint", nullable=true)
     */
    private $isMesoFormLead;

    /**
     * @ORM\Column(name="is_account", type="smallint", nullable=true)
     */
    private $isAccount;

    /**
     * @ORM\Column(name="is_meso_account", type="smallint", nullable=true)
     */
    private $isMesoAccount;

    /**
     * @ORM\Column(name="is_qualified_lead", type="smallint", nullable=true)
     */
    private $isQualifiedLead;

    /**
     * @ORM\Column(name="is_account_sendover", type="smallint", nullable=true)
     */
    private $isAccountSendover;

    /**
     * @ORM\Column(name="is_account_meeting", type="smallint", nullable=true)
     */
    private $isAccountMeeting;

    /**
     * @ORM\Column(name="is_customer", type="decimal", precision=10, scale=2, nullable=true)
     */
    private $isCustomer;

    /**
     * @ORM\Column(name="is_viable", type="smallint", nullable=true)
     */
    private $isViable;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $source;

    public function getMdId(): ?string
    {
        return $this->mdId;
    }

    public function setMdId(string $mdId): self
    {
        $this->mdId = $mdId;

        return $this;
    }

    public function getLeadId(): ?string
    {
        return $this->leadId;
    }

    public function setLeadId(?string $leadId): self
    {
        $this->leadId = $leadId;

        return $this;
    }

    public function getDate(): ?\DateTimeInterface
    {
        return $this->date;
    }

    public function setDate(\DateTimeInterface $date): self
    {
        $this->date = $date;

        return $this;
    }

    public function getCampaignId(): ?string
    {
        return $this->campaignId;
    }

    public function setCampaignId(?string $campaignId): self
    {
        $this->campaignId = $campaignId;

        return $this;
    }

    public function getAdgroupId(): ?string
    {
        return $this->adgroupId;
    }

    public function setAdgroupId(?string $adgroupId): self
    {
        $this->adgroupId = $adgroupId;

        return $this;
    }

    public function getKeywordId(): ?string
    {
        return $this->keywordId;
    }

    public function setKeywordId(?string $keywordId): self
    {
        $this->keywordId = $keywordId;

        return $this;
    }

    public function getCreativeId(): ?int
    {
        return $this->creativeId;
    }

    public function setCreativeId(?int $creativeId): self
    {
        $this->creativeId = $creativeId;

        return $this;
    }

    public function getIsMd(): ?int
    {
        return $this->isMd;
    }

    public function setIsMd(?int $isMd): self
    {
        $this->isMd = $isMd;

        return $this;
    }

    public function getIsLead(): ?int
    {
        return $this->isLead;
    }

    public function setIsLead(?int $isLead): self
    {
        $this->isLead = $isLead;

        return $this;
    }

    public function getIsMesoFormLead(): ?int
    {
        return $this->isMesoFormLead;
    }

    public function setIsMesoFormLead(int $isMesoFormLead): self
    {
        $this->isMesoFormLead = $isMesoFormLead;

        return $this;
    }

    public function getIsAccount(): ?int
    {
        return $this->isAccount;
    }

    public function setIsAccount(?int $isAccount): self
    {
        $this->isAccount = $isAccount;

        return $this;
    }

    public function getIsMesoAccount(): ?int
    {
        return $this->isMesoAccount;
    }

    public function setIsMesoAccount(?int $isMesoAccount): self
    {
        $this->isMesoAccount = $isMesoAccount;

        return $this;
    }

    public function getIsQualifiedLead(): ?int
    {
        return $this->isQualifiedLead;
    }

    public function setIsQualifiedLead(?int $isQualifiedLead): self
    {
        $this->isQualifiedLead = $isQualifiedLead;

        return $this;
    }

    public function getIsAccountSendover(): ?int
    {
        return $this->isAccountSendover;
    }

    public function setIsAccountSendover(?int $isAccountSendover): self
    {
        $this->isAccountSendover = $isAccountSendover;

        return $this;
    }

    public function getIsAccountMeeting(): ?int
    {
        return $this->isAccountMeeting;
    }

    public function setIsAccountMeeting(?int $isAccountMeeting): self
    {
        $this->isAccountMeeting = $isAccountMeeting;

        return $this;
    }

    public function getIsCustomer()
    {
        return $this->isCustomer;
    }

    public function setIsCustomer($isCustomer): self
    {
        $this->isCustomer = $isCustomer;

        return $this;
    }

    public function getIsViable(): ?int
    {
        return $this->isViable;
    }

    public function setIsViable(?int $isViable): self
    {
        $this->isViable = $isViable;

        return $this;
    }

    public function getSource(): ?string
    {
        return $this->source;
    }

    public function setSource(?string $source): self
    {
        $this->source = $source;

        return $this;
    }
}
