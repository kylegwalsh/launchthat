<?php

namespace App\Repository;

use App\Entity\Keywords;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;
use Doctrine\ORM\Query;
use Doctrine\ORM\Query\ResultSetMapping;
use Symfony\Component\Cache\Adapter\RedisAdapter;
use Symfony\Contracts\Cache\ItemInterface;

/**
 * @method Keywords|null find($id, $lockMode = null, $lockVersion = null)
 * @method Keywords|null findOneBy(array $criteria, array $orderBy = null)
 * @method Keywords[]    findAll()
 * @method Keywords[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class KeywordsRepository extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, Keywords::class);
        $client = RedisAdapter::createConnection(
          $_ENV['REDIS_URL']
      );
      $this->cache = new RedisAdapter($client);
    }

    private function _hash($options) {
      $options = print_r($options, true);
      return md5($options);
    }

    public function getAccountsRawQuery($options) {
        return $this->_em->getConnection()->query("
            with campaigns_base as (
                select distinct
                A.account,
                cast(A.account_id as char) as account_id,
                A.campaign, 
                cast(A.campaign_id as char) as campaign_id,
                A.platform,
                sum(A.clicks) as clicks,
                sum(A.cost) as cost,
                sum(A.impressions) as impressions
                from paidpal.keywords as A
                WHERE A.date between '$options[startDate]' and '$options[endDate]'
                group by 1,2,3,4,5
            ),
            asbestos_base as 
            (
                select distinct 
                cast(A.campaign_id as char) as campaign_id,
                sum(A.is_md) as is_md,
                sum(A.is_lead) as is_lead,
                sum(A.is_meso_form_lead) as is_meso_form_lead,
                sum(A.is_account) as is_account,
                sum(A.is_meso_account) as is_meso_account,
                sum(A.is_qualified_lead) as is_qualified_lead,
                sum(A.is_viable) as is_viable,
                sum(A.is_account_sendover) as is_account_sendover,
                sum(A.is_account_meeting) as is_account_meeting,
                sum(A.is_customer) as is_customer
                from paidpal.asbestos_leads as A
                where A.date between '$options[startDate]' and '$options[endDate]'
                group by 1
            ),
            joined_data as 
            (
                select distinct 
                A.account,
                A.account_id,
                A.campaign, 
                A.campaign_id,
                A.platform,
                sum(A.cost) as cost,
                sum(A.clicks) as clicks,
                sum(A.impressions) as impressions, 
                sum(B.is_md) as is_md,
                sum(B.is_lead) as is_lead,
                sum(B.is_meso_form_lead) as is_meso_form_lead,
                sum(B.is_account) as is_account,
                sum(B.is_meso_account) as is_meso_account,
                sum(B.is_qualified_lead) as is_qualified_lead,
                sum(B.is_viable) as is_viable,
                sum(B.is_account_sendover) as is_account_sendover,
                sum(B.is_account_meeting) as is_account_meeting,
                sum(B.is_customer) as is_customer
                from campaigns_base as A
                left join asbestos_base as B on A.campaign_id = B.campaign_id
                group by 1,2,3,4,5
            ),
            aggregated_data as (
                select distinct
                account,
                account_id,
                platform,
                sum(cost) as cost,
                sum(clicks) as clicks,
                sum(impressions) as impressions, 
                sum(is_md) as is_md,
                sum(is_lead) as is_lead,
                sum(is_meso_form_lead) as is_meso_form_lead,
                sum(is_account) as is_account,
                sum(is_meso_account) as is_meso_account,
                sum(is_qualified_lead) as is_qualified_lead,
                sum(is_viable) as is_viable,
                sum(is_account_sendover) as is_account_sendover,
                sum(is_account_meeting) as is_account_meeting,
                sum(is_customer) as is_customer
                from joined_data as A
                group by 1,2,3
            ),
            calculated_data as (
                select distinct
                coalesce(account, 'Unknown') as account,
                coalesce(account_id, '-1') as accountId,
                coalesce(platform,'Unknown') as platform,
                coalesce(impressions,0) as impressions,
                coalesce(clicks,0) as clicks,
                coalesce(cost,0) as cost,
                coalesce(round((clicks/impressions)*100,2),0) as ctr,
                coalesce(is_md,0) as mds,
                coalesce(round(cost/is_md,2),0) as cpmd,
                coalesce(is_lead,0) as leads,
                coalesce(round(cost/is_lead,2),0) as cpl,
                coalesce(is_meso_form_lead,0) as mesoFormLeads,
                coalesce(round(cost/is_meso_form_lead,2),0) as cpmfl,
                coalesce(is_account,0) as accounts,
                coalesce(round(cost/is_account,2),0) as cpa,
                coalesce(is_meso_account,0) as mesoAccounts,
                coalesce(round(cost/is_meso_account,2),0) as cpma,
                coalesce(is_qualified_lead,0) as qualifiedLeads,
                coalesce(round(cost/is_qualified_lead,2),0) as cpql,
                coalesce(is_viable,0) as viables,
                coalesce(round(cost/is_viable,2),0) as cpv,
                coalesce(is_account_sendover,0) as accountSendovers,
                coalesce(round(cost/is_account_sendover,2),0) as cpas,
                coalesce(is_account_meeting,0) as accountMeetings,
                coalesce(round(cost/is_account_meeting,2),0) as cpam,
                coalesce(is_customer,0) as customers,
                coalesce(round(cost/is_customer,2),0) as cpcust
                from aggregated_data
            )
            select distinct
            account,
            accountId,
            platform,
            impressions,
            clicks,
            cost,
            ctr,
            mds,
            cpmd,
            leads,
            cpl,
            mesoFormLeads,
            cpmfl,
            accounts,
            cpa,
            mesoAccounts,
            cpma,
            qualifiedLeads,
            cpql,
            viables,
            cpv,
            accountSendovers,
            cpas,
            accountMeetings,
            cpam,
            customers,
            cpcust
            from calculated_data $options[where] order by account asc
        ")->fetchAll();
    }

    public function getCampaignsRawQuery($options) {
        return $this->_em->getConnection()->query("
            with campaigns_base as (
                select distinct
                cast(A.account_id as char) as account_id,
                cast(A.campaign_id as char) as campaign_id,
                A.platform,
                sum(A.clicks) as clicks,
                sum(A.cost) as cost,
                sum(A.impressions) as impressions
                from paidpal.keywords as A
                WHERE A.date between '$options[startDate]' and '$options[endDate]'
                group by 1,2,3
            ),
            asbestos_base as 
            (
                select distinct 
                cast(A.campaign_id as char) as campaign_id,
                A.source,
                sum(A.is_md) as is_md,
                sum(A.is_lead) as is_lead,
                sum(A.is_meso_form_lead) as is_meso_form_lead,
                sum(A.is_account) as is_account,
                sum(A.is_meso_account) as is_meso_account,
                sum(A.is_qualified_lead) as is_qualified_lead,
                sum(A.is_viable) as is_viable,
                sum(A.is_account_sendover) as is_account_sendover,
                sum(A.is_account_meeting) as is_account_meeting,
                sum(A.is_customer) as is_customer
                from paidpal.asbestos_leads as A
                where A.date between '$options[startDate]' and '$options[endDate]'
                group by 1,2
            ),
            latest_campaign as 
            (
                select distinct 
                cast(A.campaign_id as char) as campaign_id,
                max(A.date) as date
                from paidpal.keywords as A
                WHERE A.date between '$options[startDate]' and '$options[endDate]'
                group by 1
            ),
            state_base as
            (
                select distinct
                cast(A.campaign_id as char) as campaign_id,
                CASE 
                    WHEN A.campaign_state = 'removed' THEN 'Removed'
                    WHEN A.campaign_state = 'paused' OR A.campaign_state = 'Paused' THEN 'Paused'
                    WHEN A.campaign_state = 'enabled' OR A.campaign_state = 'Active' THEN 'Active'
                    ELSE A.campaign_state
                END as status,
                account,
                campaign
                from paidpal.keywords as A
                inner join latest_campaign as C on cast(A.campaign_id as char) = C.campaign_id and A.date = C.date
            ),
            joined_data as 
            (
                select distinct 
                A.account_id,
                A.campaign_id,
                A.platform,
                C.status,
                C.account,
                C.campaign,
                sum(A.cost) as cost,
                sum(A.clicks) as clicks,
                sum(A.impressions) as impressions, 
                sum(B.is_md) as is_md,
                sum(B.is_lead) as is_lead,
                sum(B.is_meso_form_lead) as is_meso_form_lead,
                sum(B.is_account) as is_account,
                sum(B.is_meso_account) as is_meso_account,
                sum(B.is_qualified_lead) as is_qualified_lead,
                sum(B.is_viable) as is_viable,
                sum(B.is_account_sendover) as is_account_sendover,
                sum(B.is_account_meeting) as is_account_meeting,
                sum(B.is_customer) as is_customer
                from campaigns_base as A
                left join asbestos_base as B on A.platform = B.source && A.campaign_id = B.campaign_id
                left join state_base as C on A.campaign_id = C.campaign_id
                group by 1,2,3,4,5,6
                
                union all
                select distinct 
                A.account_id,
                A.campaign_id,
                B.source,
                null as status,
                null as account,
                null as campaign, 
                sum(A.cost) as cost,
                sum(A.clicks) as clicks,
                sum(A.impressions) as impressions, 
                sum(B.is_md) as is_md,
                sum(B.is_lead) as is_lead,
                sum(B.is_meso_form_lead) as is_meso_form_lead,
                sum(B.is_account) as is_account,
                sum(B.is_meso_account) as is_meso_account,
                sum(B.is_qualified_lead) as is_qualified_lead,
                sum(B.is_viable) as is_viable,
                sum(B.is_account_sendover) as is_account_sendover,
                sum(B.is_account_meeting) as is_account_meeting,
                sum(B.is_customer) as is_customer
                from campaigns_base as A
                right join asbestos_base as B on A.platform = B.source && A.campaign_id = B.campaign_id
                where A.campaign_id is null
                group by 1,2,3,4,5,6
            ),
            calculated_data as (
                select distinct
                coalesce(account, 'Unknown') as account,
                coalesce(account_id, '-1') as accountId,
                coalesce(campaign, 'Unknown') as campaign,
                coalesce(campaign_id, '-1') as campaignId,
                coalesce(platform,'Unknown') as platform,
                coalesce(status,'Unknown') as status,
                coalesce(impressions,0) as impressions,
                coalesce(clicks,0) as clicks,
                coalesce(cost,0) as cost,
                coalesce(round((clicks/impressions)*100,2),0) as ctr,
                coalesce(is_md,0) as mds,
                coalesce(round(cost/is_md,2),0) as cpmd,
                coalesce(is_lead,0) as leads,
                coalesce(round(cost/is_lead,2),0) as cpl,
                coalesce(is_meso_form_lead,0) as mesoFormLeads,
                coalesce(round(cost/is_meso_form_lead,2),0) as cpmfl,
                coalesce(is_account,0) as accounts,
                coalesce(round(cost/is_account,2),0) as cpa,
                coalesce(is_meso_account,0) as mesoAccounts,
                coalesce(round(cost/is_meso_account,2),0) as cpma,
                coalesce(is_qualified_lead,0) as qualifiedLeads,
                coalesce(round(cost/is_qualified_lead,2),0) as cpql,
                coalesce(is_viable,0) as viables,
                coalesce(round(cost/is_viable,2),0) as cpv,
                coalesce(is_account_sendover,0) as accountSendovers,
                coalesce(round(cost/is_account_sendover,2),0) as cpas,
                coalesce(is_account_meeting,0) as accountMeetings,
                coalesce(round(cost/is_account_meeting,2),0) as cpam,
                coalesce(is_customer,0) as customers,
                coalesce(round(cost/is_customer,2),0) as cpcust
                from joined_data
            )
            select distinct
            account,
            accountId,
            campaign,
            campaignId,
            platform,
            status,
            impressions,
            clicks,
            cost,
            ctr,
            mds,
            cpmd,
            leads,
            cpl,
            mesoFormLeads,
            cpmfl,
            accounts,
            cpa,
            mesoAccounts,
            cpma,
            qualifiedLeads,
            cpql,
            viables,
            cpv,
            accountSendovers,
            cpas,
            accountMeetings,
            cpam,
            customers,
            cpcust
            from calculated_data $options[where] order by campaign asc
        ")->fetchAll();
    }

    public function getAdgroupsRawQuery($options) {
        return $this->_em->getConnection()->query("
          with adgroups_base as (
            select distinct
            cast(A.account_id as char) as account_id,
            cast(A.campaign_id as char) as campaign_id,
            cast(A.adgroup_id as char) as adgroup_id,
            A.platform,
            max(A.max_cpc) as max_cpc,
            sum(A.clicks) as clicks,
            sum(A.cost) as cost,
            sum(A.impressions) as impressions
            from paidpal.keywords as A
            WHERE A.date between '$options[startDate]' and '$options[endDate]'
            group by 1,2,3,4
          ),
          asbestos_base as 
          (
            select distinct 
            cast(A.campaign_id as char) as campaign_id,
            cast(A.adgroup_id as char) as adgroup_id,
            A.source,   
            sum(A.is_md) as is_md,
            sum(A.is_lead) as is_lead,
            sum(A.is_meso_form_lead) as is_meso_form_lead,
            sum(A.is_account) as is_account,
            sum(A.is_meso_account) as is_meso_account,
            sum(A.is_qualified_lead) as is_qualified_lead,
            sum(A.is_viable) as is_viable,
            sum(A.is_account_sendover) as is_account_sendover,
            sum(A.is_account_meeting) as is_account_meeting,
            sum(A.is_customer) as is_customer
            from paidpal.asbestos_leads as A
            where A.date between '$options[startDate]' and '$options[endDate]'
            group by 1,2,3
          ),
          latest_adgroup as 
          (
            select distinct 
            cast(A.adgroup_id as char) as adgroup_id,
            max(A.date) as date
            from paidpal.keywords as A
            WHERE A.date between '$options[startDate]' and '$options[endDate]'
            group by 1
          ),
          state_base as
          (
            select distinct
            cast(A.adgroup_id as char) as adgroup_id,
            CASE 
              WHEN A.campaign_state = 'removed' OR A.adgroup_state = 'removed' THEN 'Removed'
              WHEN A.campaign_state = 'paused' OR A.campaign_state = 'Paused' OR A.adgroup_state = 'paused' OR A.adgroup_state = 'Paused' THEN 'Paused'
              WHEN A.campaign_state = 'enabled' OR A.campaign_state = 'Active' OR A.adgroup_state = 'enabled' OR A.adgroup_state = 'Active' THEN 'Active'
              ELSE A.adgroup_state
            END as status,
            account,
            campaign,
            adgroup
            from paidpal.keywords as A
            inner join latest_adgroup as C on cast(A.adgroup_id as char) = C.adgroup_id and A.date = C.date
          ),
          joined_data as 
          (
            select distinct 
            A.account_id,
            A.campaign_id,
            A.adgroup_id,
            A.platform,
            C.status,
            C.account,
            C.campaign,
            C.adgroup,
            max(A.max_cpc) as max_cpc,
            sum(A.cost) as cost,
            sum(A.clicks) as clicks,
            sum(A.impressions) as impressions, 
            sum(B.is_md) as is_md,
            sum(B.is_lead) as is_lead,
            sum(B.is_meso_form_lead) as is_meso_form_lead,
            sum(B.is_account) as is_account,
            sum(B.is_meso_account) as is_meso_account,
            sum(B.is_qualified_lead) as is_qualified_lead,
            sum(B.is_viable) as is_viable,
            sum(B.is_account_sendover) as is_account_sendover,
            sum(B.is_account_meeting) as is_account_meeting,
            sum(B.is_customer) as is_customer
            from adgroups_base as A
            left join asbestos_base as B on A.platform = B.source && A.campaign_id = B.campaign_id and A.adgroup_id = B.adgroup_id
            left join state_base as C on A.adgroup_id = C.adgroup_id
            group by 1,2,3,4,5,6,7,8
            
            union all
            select distinct 
            A.account_id,
            A.campaign_id,
            A.adgroup_id,
            B.source,
            null as status,
            null as account,
            null as campaign, 
            null as adgroup,
            max(A.max_cpc) as max_cpc,
            sum(A.cost) as cost,
            sum(A.clicks) as clicks,
            sum(A.impressions) as impressions, 
            sum(B.is_md) as is_md,
            sum(B.is_lead) as is_lead,
            sum(B.is_meso_form_lead) as is_meso_form_lead,
            sum(B.is_account) as is_account,
            sum(B.is_meso_account) as is_meso_account,
            sum(B.is_qualified_lead) as is_qualified_lead,
            sum(B.is_viable) as is_viable,
            sum(B.is_account_sendover) as is_account_sendover,
            sum(B.is_account_meeting) as is_account_meeting,
            sum(B.is_customer) as is_customer
            from adgroups_base as A
            right join asbestos_base as B on A.platform = B.source && A.campaign_id = B.campaign_id and A.adgroup_id = B.adgroup_id
            where A.campaign_id is null
            group by 1,2,3,4,5,6,7,8
          ),
          calculated_data as (
            select distinct
            coalesce(account, 'Unknown') as account,
            coalesce(account_id, '-1') as accountId,
            coalesce(campaign, 'Unknown') as campaign,
            coalesce(campaign_id, '-1') as campaignId,
            coalesce(adgroup, 'Unknown') as adgroup,
            coalesce(adgroup_id, '-1') as adgroupId,
            coalesce(platform,'Unknown') as platform,
            coalesce(status,'Unknown') as status,
            coalesce(impressions,0) as impressions,
            coalesce(clicks,0) as clicks,
            coalesce(cost,0) as cost,
            coalesce(round((clicks/impressions)*100,2),0) as ctr,
            coalesce(round(cost/clicks,2),0) as cpc,
            coalesce(max_cpc,0) as maxCpc,
            coalesce(is_md,0) as mds,
            coalesce(round(cost/is_md,2),0) as cpmd,
            coalesce(is_lead,0) as leads,
            coalesce(round(cost/is_lead,2),0) as cpl,
            coalesce(is_meso_form_lead,0) as mesoFormLeads,
            coalesce(round(cost/is_meso_form_lead,2),0) as cpmfl,
            coalesce(is_account,0) as accounts,
            coalesce(round(cost/is_account,2),0) as cpa,
            coalesce(is_meso_account,0) as mesoAccounts,
            coalesce(round(cost/is_meso_account,2),0) as cpma,
            coalesce(is_qualified_lead,0) as qualifiedLeads,
            coalesce(round(cost/is_qualified_lead,2),0) as cpql,
            coalesce(is_viable,0) as viables,
            coalesce(round(cost/is_viable,2),0) as cpv,
            coalesce(is_account_sendover,0) as accountSendovers,
            coalesce(round(cost/is_account_sendover,2),0) as cpas,
            coalesce(is_account_meeting,0) as accountMeetings,
            coalesce(round(cost/is_account_meeting,2),0) as cpam,
            coalesce(is_customer,0) as customers,
            coalesce(round(cost/is_customer,2),0) as cpcust
            from joined_data
          )
          select distinct
          account,
          accountId,
          campaign,
          campaignId,
          adgroup,
          adgroupId,
          platform,
          status,
          impressions,
          clicks,
          cost,
          ctr,
          cpc,
          maxCpc,
          mds,
          cpmd,
          leads,
          cpl,
          mesoFormLeads,
          cpmfl,
          accounts,
          cpa,
          mesoAccounts,
          cpma,
          qualifiedLeads,
          cpql,
          viables,
          cpv,
          accountSendovers,
          cpas,
          accountMeetings,
          cpam,
          customers,
          cpcust
          from calculated_data $options[where] order by adgroup asc
        ")->fetchAll();
    }

    public function getCreativesRawQuery($options) {
        return $this->_em->getConnection()->query("
          with creatives_base as (
            select distinct
            cast(A.account_id as char) as account_id,
            cast(A.campaign_id as char) as campaign_id,
            cast(A.adgroup_id as char) as adgroup_id,
            cast(A.creative_id as char) as creative_id,
            A.platform,
            sum(A.clicks) as clicks,
            sum(A.cost) as cost,
            sum(A.impressions) as impressions
            from paidpal.creatives as A
            WHERE A.date between '$options[startDate]' and '$options[endDate]'
            group by 1,2,3,4,5
          ),
          asbestos_base as 
          (
            select distinct 
            cast(A.campaign_id as char) as campaign_id,
            cast(A.adgroup_id as char) as adgroup_id,
            cast(A.creative_id as char) as creative_id,
            A.source,   
            sum(A.is_md) as is_md,
            sum(A.is_lead) as is_lead,
            sum(A.is_meso_form_lead) as is_meso_form_lead,
            sum(A.is_account) as is_account,
            sum(A.is_meso_account) as is_meso_account,
            sum(A.is_qualified_lead) as is_qualified_lead,
            sum(A.is_viable) as is_viable,
            sum(A.is_account_sendover) as is_account_sendover,
            sum(A.is_account_meeting) as is_account_meeting,
            sum(A.is_customer) as is_customer
            from paidpal.asbestos_leads as A
            where A.date between '$options[startDate]' and '$options[endDate]'
            group by 1,2,3,4
          ),
          latest_creative as 
          (
            select distinct 
            cast(A.creative_id as char) as creative_id,
            max(A.date) as date
            from paidpal.creatives as A
            WHERE A.date between '$options[startDate]' and '$options[endDate]'
            group by 1
          ),
          state_base as
          (
            select distinct
            cast(A.creative_id as char) as creative_id,
            CASE 
              WHEN A.campaign_state = 'removed' OR A.adgroup_state = 'removed' THEN 'Removed'
              WHEN A.campaign_state = 'paused' OR A.campaign_state = 'Paused' OR A.adgroup_state = 'paused' OR A.adgroup_state = 'Paused' OR A.creative_state = 'paused' OR A.creative_state = 'Paused' OR A.creative_state = 'disabled' THEN 'Paused'
              WHEN A.campaign_state = 'enabled' OR A.campaign_state = 'Active' OR A.adgroup_state = 'enabled' OR A.adgroup_state = 'Active' OR A.creative_state = 'enabled' OR A.creative_state = 'Active' THEN 'Active'
              ELSE A.creative_state
            END as status,
            account,
            campaign, 
            adgroup,
            url,
            headline1,
            headline2,
            description1,
            description2
            from paidpal.creatives as A
            inner join latest_creative as C on cast(A.creative_id as char) = C.creative_id and A.date = C.date
          ),

          joined_data as 
          (
            select distinct 
            A.account_id,
            A.campaign_id,
            A.adgroup_id,
            A.creative_id,
            A.platform,
            C.status,
            C.account,
            C.campaign, 
            C.adgroup,
            C.url,
            C.headline1,
            C.headline2,
            C.description1,
            C.description2,
            sum(A.cost) as cost,
            sum(A.clicks) as clicks,
            sum(A.impressions) as impressions, 
            sum(B.is_md) as is_md,
            sum(B.is_lead) as is_lead,
            sum(B.is_meso_form_lead) as is_meso_form_lead,
            sum(B.is_account) as is_account,
            sum(B.is_meso_account) as is_meso_account,
            sum(B.is_qualified_lead) as is_qualified_lead,
            sum(B.is_viable) as is_viable,
            sum(B.is_account_sendover) as is_account_sendover,
            sum(B.is_account_meeting) as is_account_meeting,
            sum(B.is_customer) as is_customer
            from creatives_base as A
            left join asbestos_base as B on A.platform = B.source && A.campaign_id = B.campaign_id and A.adgroup_id = B.adgroup_id and A.creative_id = B.creative_id
            left join state_base as C on A.creative_id = C.creative_id
            group by 1,2,3,4,5,6,7,8,9,10,11,12,13,14
            
            union all
            select distinct 
            A.account_id,
            A.campaign_id,
            A.adgroup_id,
            A.creative_id,
            B.source,
            null as status,
            null as account,
            null as campaign, 
            null as adgroup,
            null as url,
            null as headline1,
            null as headline2,
            null as description1,
            null as description2,
            sum(A.cost) as cost,
            sum(A.clicks) as clicks,
            sum(A.impressions) as impressions, 
            sum(B.is_md) as is_md,
            sum(B.is_lead) as is_lead,
            sum(B.is_meso_form_lead) as is_meso_form_lead,
            sum(B.is_account) as is_account,
            sum(B.is_meso_account) as is_meso_account,
            sum(B.is_qualified_lead) as is_qualified_lead,
            sum(B.is_viable) as is_viable,
            sum(B.is_account_sendover) as is_account_sendover,
            sum(B.is_account_meeting) as is_account_meeting,
            sum(B.is_customer) as is_customer
            from creatives_base as A
            right join asbestos_base as B on A.platform = B.source && A.campaign_id = B.campaign_id and A.adgroup_id = B.adgroup_id and A.creative_id = B.creative_id
            where A.campaign_id is null
            group by 1,2,3,4,5,6,7,8,9,10,11,12,13,14
          ),
          calculated_data as (
            select distinct
            coalesce(account, 'Unknown') as account,
            coalesce(account_id, '-1') as accountId,
            coalesce(campaign, 'Unknown') as campaign,
            coalesce(campaign_id, '-1') as campaignId,
            coalesce(adgroup, 'Unknown') as adgroup,
            coalesce(adgroup_id, '-1') as adgroupId,
            coalesce(creative_id, '-1') as creativeId,
            coalesce(platform,'Unknown') as platform,
            coalesce(url,'Unknown') as url,
            coalesce(headline1,'Unknown') as headline1,
            coalesce(headline2,'Unknown') as headline2,
            coalesce(description1,'Unknown') as description1,
            coalesce(description2,'Unknown') as description2,
            coalesce(status,'Unknown') as status,
            coalesce(impressions,0) as impressions,
            coalesce(clicks,0) as clicks,
            coalesce(cost,0) as cost,
            coalesce(round((clicks/impressions)*100,2),0) as ctr,
            coalesce(is_md,0) as mds,
            coalesce(round(cost/is_md,2),0) as cpmd,
            coalesce(is_lead,0) as leads,
            coalesce(round(cost/is_lead,2),0) as cpl,
            coalesce(is_meso_form_lead,0) as mesoFormLeads,
            coalesce(round(cost/is_meso_form_lead,2),0) as cpmfl,
            coalesce(is_account,0) as accounts,
            coalesce(round(cost/is_account,2),0) as cpa,
            coalesce(is_meso_account,0) as mesoAccounts,
            coalesce(round(cost/is_meso_account,2),0) as cpma,
            coalesce(is_qualified_lead,0) as qualifiedLeads,
            coalesce(round(cost/is_qualified_lead,2),0) as cpql,
            coalesce(is_viable,0) as viables,
            coalesce(round(cost/is_viable,2),0) as cpv,
            coalesce(is_account_sendover,0) as accountSendovers,
            coalesce(round(cost/is_account_sendover,2),0) as cpas,
            coalesce(is_account_meeting,0) as accountMeetings,
            coalesce(round(cost/is_account_meeting,2),0) as cpam,
            coalesce(is_customer,0) as customers,
            coalesce(round(cost/is_customer,2),0) as cpcust
            from joined_data
          )
          select distinct
          account,
          accountId,
          campaign,
          campaignId,
          adgroup,
          adgroupId,
          creativeId,
          platform,
          url,
          headline1,
          headline2,
          description1,
          description2,
          status,
          impressions,
          clicks,
          cost,
          ctr,
          mds,
          cpmd,
          leads,
          cpl,
          mesoFormLeads,
          cpmfl,
          accounts,
          cpa,
          mesoAccounts,
          cpma,
          qualifiedLeads,
          cpql,
          viables,
          cpv,
          accountSendovers,
          cpas,
          accountMeetings,
          cpam,
          customers,
          cpcust
          from calculated_data $options[where] order by headline1 asc
        ")->fetchAll();
    }

    public function getKeywordsRawQuery($options) {
      $result = $this->cache->get($this->_hash($options), function (ItemInterface $item) use ($options) {
        $r = $this->_em->getConnection()->query("
          with keywords_base as (
            select distinct
            cast(A.account_id as char) as account_id,
            cast(A.campaign_id as char) as campaign_id,
            cast(A.adgroup_id as char) as adgroup_id,
            cast(A.keyword_id as char) as keyword_id,
            A.match_type,
            A.platform,
            max(A.max_cpc) as max_cpc,
            sum(A.clicks) as clicks,
            sum(A.cost) as cost,
            sum(A.impressions) as impressions
            from paidpal.keywords as A
            WHERE A.date between '$options[startDate]' and '$options[endDate]'
            group by 1,2,3,4,5,6
          ),
          asbestos_base as 
          (
            select distinct 
            cast(A.campaign_id as char) as campaign_id,
            cast(A.adgroup_id as char) as adgroup_id,
            cast(A.keyword_id as char) as keyword_id,
            A.source,
            sum(A.is_md) as is_md,
            sum(A.is_lead) as is_lead,
            sum(A.is_meso_form_lead) as is_meso_form_lead,
            sum(A.is_account) as is_account,
            sum(A.is_meso_account) as is_meso_account,
            sum(A.is_qualified_lead) as is_qualified_lead,
            sum(A.is_viable) as is_viable,
            sum(A.is_account_sendover) as is_account_sendover,
            sum(A.is_account_meeting) as is_account_meeting,
            sum(A.is_customer) as is_customer
            from paidpal.asbestos_leads as A
            where A.date between '$options[startDate]' and '$options[endDate]'
            group by 1,2,3,4
          ),
          latest_keyword as 
          (
            select distinct 
            cast(A.keyword_id as char) as keyword_id,
            max(A.date) as date
            from paidpal.keywords as A
            WHERE A.date between '$options[startDate]' and '$options[endDate]'
            group by 1
          ),
          state_base as
          (
            select distinct
            cast(A.keyword_id as char) as keyword_id,
            CASE 
              WHEN A.campaign_state = 'removed' OR A.adgroup_state = 'removed' OR A.keyword_state = 'removed' THEN 'Removed'
              WHEN A.campaign_state = 'paused' OR A.campaign_state = 'Paused' OR A.adgroup_state = 'paused' OR A.adgroup_state = 'Paused' OR A.keyword_state = 'paused' OR A.keyword_state = 'Paused' THEN 'Paused'
              WHEN A.campaign_state = 'enabled' OR A.campaign_state = 'Active' OR A.adgroup_state = 'enabled' OR A.adgroup_state = 'Active' OR A.keyword_state = 'enabled' OR A.keyword_state = 'Active' THEN 'Active'
              ELSE A.keyword_state
            END as status,
            account,
            campaign,
            adgroup,
            keyword
            from paidpal.keywords as A
            inner join latest_keyword as C on cast(A.keyword_id as char) = C.keyword_id and A.date = C.date
          ),
          joined_data as 
          (
            select distinct 
            A.account_id,
            A.campaign_id,
            A.adgroup_id,
            A.keyword_id,
            A.match_type,
            A.platform,
            C.status,
            C.account,
            C.campaign,
            C.adgroup,
            C.keyword,
            max(A.max_cpc) as max_cpc,
            sum(A.cost) as cost,
            sum(A.clicks) as clicks,
            sum(A.impressions) as impressions, 
            sum(B.is_md) as is_md,
            sum(B.is_lead) as is_lead,
            sum(B.is_meso_form_lead) as is_meso_form_lead,
            sum(B.is_account) as is_account,
            sum(B.is_meso_account) as is_meso_account,
            sum(B.is_qualified_lead) as is_qualified_lead,
            sum(B.is_viable) as is_viable,
            sum(B.is_account_sendover) as is_account_sendover,
            sum(B.is_account_meeting) as is_account_meeting,
            sum(B.is_customer) as is_customer
            from keywords_base as A
            left join asbestos_base as B on A.platform = B.source && A.campaign_id = B.campaign_id and A.adgroup_id = B.adgroup_id and A.keyword_id = B.keyword_id
            left join state_base as C on A.keyword_id = C.keyword_id
            group by 1,2,3,4,5,6,7,8,9,10,11
            
            union all
            select distinct 
            A.account_id,
            A.campaign_id,
            A.adgroup_id,
            A.keyword_id,
            A.match_type,
            B.source,
            null as status,
            null as account,
            null campaign, 
            null as adgroup,
            null as keyword,
            max(A.max_cpc) as max_cpc,
            sum(A.cost) as cost,
            sum(A.clicks) as clicks,
            sum(A.impressions) as impressions, 
            sum(B.is_md) as is_md,
            sum(B.is_lead) as is_lead,
            sum(B.is_meso_form_lead) as is_meso_form_lead,
            sum(B.is_account) as is_account,
            sum(B.is_meso_account) as is_meso_account,
            sum(B.is_qualified_lead) as is_qualified_lead,
            sum(B.is_viable) as is_viable,
            sum(B.is_account_sendover) as is_account_sendover,
            sum(B.is_account_meeting) as is_account_meeting,
            sum(B.is_customer) as is_customer
            from keywords_base as A
            right join asbestos_base as B on A.platform = B.source && A.campaign_id = B.campaign_id and A.adgroup_id = B.adgroup_id and A.keyword_id = B.keyword_id
            where A.campaign_id is null
            group by 1,2,3,4,5,6,7,8,9,10,11
          ),
          calculated_data as (
            select distinct
            coalesce(account, 'Unknown') as account,
            coalesce(account_id, '-1') as accountId,
            coalesce(campaign, 'Unknown') as campaign,
            coalesce(campaign_id, '-1') as campaignId,
            coalesce(adgroup, 'Unknown') as adgroup,
            coalesce(adgroup_id, '-1') as adgroupId,
            coalesce(keyword, 'Unknown') as keyword,
            coalesce(keyword_id, '-1') as keywordId,
            coalesce(platform,'Unknown') as platform,
            coalesce(match_type,'Unknown') as matchType,
            coalesce(status,'Unknown') as status,
            coalesce(impressions,0) as impressions,
            coalesce(clicks,0) as clicks,
            coalesce(cost,0) as cost,
            coalesce(round((clicks/impressions)*100,2),0) as ctr,
            coalesce(round(cost/clicks,2),0) as cpc,
            coalesce(max_cpc,0) as maxCpc,
            coalesce(is_md,0) as mds,
            coalesce(round(cost/is_md,2),0) as cpmd,
            coalesce(is_lead,0) as leads,
            coalesce(round(cost/is_lead,2),0) as cpl,
            coalesce(is_meso_form_lead,0) as mesoFormLeads,
            coalesce(round(cost/is_meso_form_lead,2),0) as cpmfl,
            coalesce(is_account,0) as accounts,
            coalesce(round(cost/is_account,2),0) as cpa,
            coalesce(is_meso_account,0) as mesoAccounts,
            coalesce(round(cost/is_meso_account,2),0) as cpma,
            coalesce(is_qualified_lead,0) as qualifiedLeads,
            coalesce(round(cost/is_qualified_lead,2),0) as cpql,
            coalesce(is_viable,0) as viables,
            coalesce(round(cost/is_viable,2),0) as cpv,
            coalesce(is_account_sendover,0) as accountSendovers,
            coalesce(round(cost/is_account_sendover,2),0) as cpas,
            coalesce(is_account_meeting,0) as accountMeetings,
            coalesce(round(cost/is_account_meeting,2),0) as cpam,
            coalesce(is_customer,0) as customers,
            coalesce(round(cost/is_customer,2),0) as cpcust
            from joined_data
          )
          select distinct
          account,
          accountId,
          campaign,
          campaignId,
          adgroup,
          adgroupId,
          keyword,
          keywordId,
          platform,
          matchType,
          status,
          impressions,
          clicks,
          cost,
          ctr,
          cpc,
          maxCpc,
          mds,
          cpmd,
          leads,
          cpl,
          mesoFormLeads,
          cpmfl,
          accounts,
          cpa,
          mesoAccounts,
          cpma,
          qualifiedLeads,
          cpql,
          viables,
          cpv,
          accountSendovers,
          cpas,
          accountMeetings,
          cpam,
          customers,
          cpcust
          from calculated_data $options[where] order by keyword asc
        ")->fetchAll();
        return $r;
      });
      return $result;
    }

    public function getAccounts($value) {
        return $this->createQueryBuilder('keywords')
            ->andWhere('keywords.accountId = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getResult(Query::HYDRATE_ARRAY);
    }

    public function getKeywords($value) {
        return $this->createQueryBuilder('keywords')
            ->andWhere('keywords.keyword = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getResult(Query::HYDRATE_ARRAY);
    }

    public function getRow($filter) {
        $key = key($filter);
        $where = 'keywords.' . $key . ' = :val';

        return $this->createQueryBuilder('keywords')
            ->andWhere($where)
            ->setParameter('val', $filter[$key])
            ->setMaxResults(1)
            ->orderBy('keywords.date', 'DESC')
            ->getQuery()
            ->getResult(Query::HYDRATE_ARRAY);
    }

    // /**
    //  * @return Keywords[] Returns an array of Keywords objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('k')
            ->andWhere('k.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('k.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?Keywords
    {
        return $this->createQueryBuilder('k')
            ->andWhere('k.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
