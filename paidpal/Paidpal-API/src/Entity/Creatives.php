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
 * @ORM\Table(name="creatives")
 * @ORM\Entity(repositoryClass="App\Repository\CreativesRepository")
 */
class Creatives
{
    /**
     * @ORM\Column(name="account_id", type="bigint")
     * @ORM\Id
     */
    private $accountId;

    /**
     * @ORM\Column(name="campaign_id", type="bigint")
     * @ORM\Id
     */
    private $campaignId;

    /**
     * @ORM\Column(name="adgroup_id", type="bigint")
     * @ORM\Id
     */
    private $adgroupId;

    /**
     * @ORM\Column(name="creative_id", type="bigint")
     * @ORM\Id
     */
    private $creativeId;

    /**
     * @ORM\Column(type="datetime")
     * @ORM\Id
     */
    private $date;

    /**
     * @ORM\Column(type="string", length=255)
     * @ORM\Id
     */
    private $platform;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $account;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $adgroup;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $campaign;

    /**
     * @ORM\Column(type="integer", nullable=true)
     */
    private $impressions;

    /**
     * @ORM\Column(type="integer", nullable=true)
     */
    private $clicks;

    /**
     * @ORM\Column(type="decimal", precision=10, scale=2, nullable=true)
     */
    private $cost;

    /**
     * @ORM\Column(type="text", nullable=true)
     */
    private $url;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $headline1;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $headline2;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $description1;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $description2;

    /**
     * @ORM\Column(name="adgroup_state", type="string", length=255, nullable=true)
     */
    private $adgroupState;

    /**
     * @ORM\Column(name="campaign_state", type="string", length=255, nullable=true)
     */
    private $campaignState;

    /**
     * @ORM\Column(name="creative_state", type="string", length=255, nullable=true)
     */
    private $creativeState;

    public function getAccountId(): ?int
    {
        return $this->accountId;
    }

    public function setAccountId(int $accountId): self
    {
        $this->accountId = $accountId;

        return $this;
    }

    public function getCampaignId(): ?int
    {
        return $this->campaignId;
    }

    public function setCampaignId(int $campaignId): self
    {
        $this->campaignId = $campaignId;

        return $this;
    }

    public function getAdgroupId(): ?int
    {
        return $this->adgroupId;
    }

    public function setAdgroupId(int $adgroupId): self
    {
        $this->adgroupId = $adgroupId;

        return $this;
    }

    public function getCreativeId(): ?int
    {
        return $this->creativeId;
    }

    public function setCreativeId(int $creativeId): self
    {
        $this->creativeId = $creativeId;

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

    public function getPlatform(): ?string
    {
        return $this->platform;
    }

    public function setPlatform(?string $platform): self
    {
        $this->platform = $platform;

        return $this;
    }

    public function getAccount(): ?string
    {
        return $this->account;
    }

    public function setAccount(?string $account): self
    {
        $this->account = $account;

        return $this;
    }

    public function getAdgroup(): ?string
    {
        return $this->adgroup;
    }

    public function setAdgroup(?string $adgroup): self
    {
        $this->adgroup = $adgroup;

        return $this;
    }

    public function getCampaign(): ?string
    {
        return $this->campaign;
    }

    public function setCampaign(?string $campaign): self
    {
        $this->campaign = $campaign;

        return $this;
    }

    public function getImpressions(): ?int
    {
        return $this->impressions;
    }

    public function setImpressions(?int $impressions): self
    {
        $this->impressions = $impressions;

        return $this;
    }

    public function getClicks(): ?int
    {
        return $this->clicks;
    }

    public function setClicks(?int $clicks): self
    {
        $this->clicks = $clicks;

        return $this;
    }

    public function getCost()
    {
        return $this->cost;
    }

    public function setCost($cost): self
    {
        $this->cost = $cost;

        return $this;
    }

    public function getUrl(): ?string
    {
        return $this->url;
    }

    public function setUrl(?string $url): self
    {
        $this->url = $url;

        return $this;
    }

    public function getHeadline1(): ?string
    {
        return $this->headline1;
    }

    public function setHeadline1(?string $headline1): self
    {
        $this->headline1 = $headline1;

        return $this;
    }

    public function getHeadline2(): ?string
    {
        return $this->headline2;
    }

    public function setHeadline2(?string $headline2): self
    {
        $this->headline2 = $headline2;

        return $this;
    }

    public function getDescription1(): ?string
    {
        return $this->description1;
    }

    public function setDescription1(?string $description1): self
    {
        $this->description1 = $description1;

        return $this;
    }

    public function getDescription2(): ?string
    {
        return $this->description2;
    }

    public function setDescription2(?string $description2): self
    {
        $this->description2 = $description2;

        return $this;
    }

    public function getAdgroupState(): ?string
    {
        return $this->adgroupState;
    }

    public function setAdgroupState(?string $adgroupState): self
    {
        $this->adgroupState = $adgroupState;

        return $this;
    }

    public function getCampaignState(): ?string
    {
        return $this->campaignState;
    }

    public function setCampaignState(?string $campaignState): self
    {
        $this->campaignState = $campaignState;

        return $this;
    }

    public function getCreativeState(): ?string
    {
        return $this->creativeState;
    }

    public function setCreativeState(?string $creativeState): self
    {
        $this->creativeState = $creativeState;

        return $this;
    }
}
