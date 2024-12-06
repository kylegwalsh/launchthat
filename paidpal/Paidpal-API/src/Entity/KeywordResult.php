<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ApiResource()
 * @ORM\Entity(repositoryClass="App\Repository\KeywordResultRepository")
 */
class KeywordResult
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $account;

    /**
     * @ORM\Column(type="integer")
     */
    private $account_id;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $campaign;

    /**
     * @ORM\Column(type="integer")
     */
    private $campaign_id;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $adgroup;

    /**
     * @ORM\Column(type="integer")
     */
    private $adgroup_id;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $keyword;

    /**
     * @ORM\Column(type="integer")
     */
    private $keyword_id;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $platform;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $match_type;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $keyword_state;

    /**
     * @ORM\Column(type="integer")
     */
    private $impressions;

    /**
     * @ORM\Column(type="integer")
     */
    private $clicks;

    /**
     * @ORM\Column(type="decimal", precision=10, scale=0)
     */
    private $cost;

    /**
     * @ORM\Column(type="decimal", precision=10, scale=0)
     */
    private $ctr;

    /**
     * @ORM\Column(type="decimal", precision=10, scale=0)
     */
    private $cpc;

    /**
     * @ORM\Column(type="decimal", precision=10, scale=0)
     */
    private $max_cpc;

    /**
     * @ORM\Column(type="integer")
     */
    private $mds;

    /**
     * @ORM\Column(type="decimal", precision=10, scale=0)
     */
    private $cpmd;

    /**
     * @ORM\Column(type="integer")
     */
    private $leads;

    public function getId(): ?int
    {
        return $this->id;
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

    public function getAccountId(): ?int
    {
        return $this->account_id;
    }

    public function setAccountId(int $account_id): self
    {
        $this->account_id = $account_id;

        return $this;
    }

    public function getCampaign(): ?string
    {
        return $this->campaign;
    }

    public function setCampaign(string $campaign): self
    {
        $this->campaign = $campaign;

        return $this;
    }

    public function getCampaignId(): ?int
    {
        return $this->campaign_id;
    }

    public function setCampaignId(int $campaign_id): self
    {
        $this->campaign_id = $campaign_id;

        return $this;
    }

    public function getAdgroup(): ?string
    {
        return $this->adgroup;
    }

    public function setAdgroup(string $adgroup): self
    {
        $this->adgroup = $adgroup;

        return $this;
    }

    public function getAdgroupId(): ?int
    {
        return $this->adgroup_id;
    }

    public function setAdgroupId(int $adgroup_id): self
    {
        $this->adgroup_id = $adgroup_id;

        return $this;
    }

    public function getKeyword(): ?string
    {
        return $this->keyword;
    }

    public function setKeyword(string $keyword): self
    {
        $this->keyword = $keyword;

        return $this;
    }

    public function getKeywordId(): ?int
    {
        return $this->keyword_id;
    }

    public function setKeywordId(int $keyword_id): self
    {
        $this->keyword_id = $keyword_id;

        return $this;
    }

    public function getPlatform(): ?string
    {
        return $this->platform;
    }

    public function setPlatform(string $platform): self
    {
        $this->platform = $platform;

        return $this;
    }

    public function getMatchType(): ?string
    {
        return $this->match_type;
    }

    public function setMatchType(string $match_type): self
    {
        $this->match_type = $match_type;

        return $this;
    }

    public function getKeywordState(): ?string
    {
        return $this->keyword_state;
    }

    public function setKeywordState(string $keyword_state): self
    {
        $this->keyword_state = $keyword_state;

        return $this;
    }

    public function getImpressions(): ?int
    {
        return $this->impressions;
    }

    public function setImpressions(int $impressions): self
    {
        $this->impressions = $impressions;

        return $this;
    }

    public function getClicks(): ?int
    {
        return $this->clicks;
    }

    public function setClicks(int $clicks): self
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

    public function getCtr()
    {
        return $this->ctr;
    }

    public function setCtr($ctr): self
    {
        $this->ctr = $ctr;

        return $this;
    }

    public function getCpc()
    {
        return $this->cpc;
    }

    public function setCpc($cpc): self
    {
        $this->cpc = $cpc;

        return $this;
    }

    public function getMaxCpc()
    {
        return $this->max_cpc;
    }

    public function setMaxCpc($max_cpc): self
    {
        $this->max_cpc = $max_cpc;

        return $this;
    }

    public function getMds(): ?int
    {
        return $this->mds;
    }

    public function setMds(int $mds): self
    {
        $this->mds = $mds;

        return $this;
    }

    public function getCpmd()
    {
        return $this->cpmd;
    }

    public function setCpmd($cpmd): self
    {
        $this->cpmd = $cpmd;

        return $this;
    }

    public function getLeads(): ?int
    {
        return $this->leads;
    }

    public function setLeads(int $leads): self
    {
        $this->leads = $leads;

        return $this;
    }
}
