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
 * @ORM\Table(name="keywords")
 * @ORM\Entity(repositoryClass="App\Repository\KeywordsRepository")
 */
class Keywords
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
     * @ORM\Column(name="keyword_id", type="bigint")
     * @ORM\Id
     */
    private $keywordId;

    /**
     * @ORM\Column(type="datetime")
     * @ORM\Id
     */
    private $date;

    /**
     * @ORM\Column(name="match_type", type="string", length=255)
     * @ORM\Id
     */
    private $matchType;

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
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $keyword;

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
     * @ORM\Column(name="adgroup_state", type="string", length=255, nullable=true)
     */
    private $adgroupState;

    /**
     * @ORM\Column(name="campaign_state", type="string", length=255, nullable=true)
     */
    private $campaignState;

    /**
     * @ORM\Column(name="keyword_state", type="string", length=255, nullable=true)
     */
    private $keywordState;

    /**
     * @ORM\Column(name="max_cpc", type="decimal", precision=10, scale=2, nullable=true)
     */
    private $maxCpc;

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

    public function getKeywordId(): ?int
    {
        return $this->keywordId;
    }

    public function setKeywordId(int $keywordId): self
    {
        $this->keywordId = $keywordId;

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

    public function getMatchType(): ?string
    {
        return $this->matchType;
    }

    public function setMatchType(?string $matchType): self
    {
        $this->matchType = $matchType;

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

    public function getKeyword(): ?string
    {
        return $this->keyword;
    }

    public function setKeyword(?string $keyword): self
    {
        $this->keyword = $keyword;

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

    public function getKeywordState(): ?string
    {
        return $this->keywordState;
    }

    public function setKeywordState(?string $keywordState): self
    {
        $this->keywordState = $keywordState;

        return $this;
    }

    public function getMaxCpc()
    {
        return $this->maxCpc;
    }

    public function setMaxCpc($maxCpc): self
    {
        $this->maxCpc = $maxCpc;

        return $this;
    }
}
