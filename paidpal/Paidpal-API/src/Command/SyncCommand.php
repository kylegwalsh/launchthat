<?php

namespace App\Command;

use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

use Aws\S3\S3Client;
use Aws\DataPipeline\DataPipelineClient;
use Aws\S3\Exception\S3Exception;
use Aws\DataPipeline\Exception\DataPipelineException;

class SyncCommand extends Command
{
    protected static $defaultName = 'app:sync';

    private $pdo;
    private $s3;
    private $pipeline;
    private $now;
    private $start;

    /**
     * @param S3Client              $s3
     * @param DataPipelineClient    $pipeline
     */
    public function __construct(S3Client $s3, DataPipelineClient $pipeline) 
    {
        $this->s3 = $s3;
        $this->pipeline = $pipeline;
        $this->now = new \DateTime('now');
        $this->start = new \DateTime();

        parent::__construct();
    }


    protected function configure()
    {
        $this
            ->setDescription('Add a short description for your command');
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {

        $this->now->sub(new \DateInterval('P1D'));
        $this->now = $this->now->format('Y-m-d');

        $this->start->sub(new \DateInterval('P33D'));
        $this->start = $this->start->format('Y-m-d');

        $container = $this->getApplication()->getKernel()->getContainer();
        $host = $container->getParameter('redshift_host');
        $dbName = $container->getParameter('redshift_db');
        $username = $container->getParameter('redshift_user');
        $password = $container->getParameter('redshift_pass');

        $dsn = 'pgsql:host='.$host.';port=5439;dbname='.$dbName.';';

        try {
            $this->pdo = new \PDO($dsn, $username, $password);
            $this->pdo->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
        }catch( \PDOException $exception ) {
            dump($exception->getMessage());
            throw $exception->getMessage().$exception->getCode();
        }


        
        // Keywords
        $this->executeKeywords();
        // Fire Keywords line
        $this->pipeline->activatePipeline(array(
            'pipelineId' => 'df-02802792MPAE11Z9DE64'
        ));
        


        // Creatives
        $this->executeCreative();

        // Fire Creatives line
        $this->pipeline->activatePipeline(array(
            'pipelineId' => 'df-08789751GR0PGE573COG'
        ));


        // Asbestos Leads
        $this->executeAsbestos();

        // Fire Asbesots line
        $this->pipeline->activatePipeline(array(
            'pipelineId' => 'df-06663271K57VD8P7RZTR'
        ));


        #TODO: Add Error handling


    }

    private function s3Clear($prefix)
    {
        $bucket = 'paidpal-dataloader';
        $keys = $this->s3->listObjectsV2([
            'Bucket' => $bucket,
            'Prefix' => $prefix,
            'startAfter' => $prefix,
        ])->getPath('Contents');

        
        array_shift($keys);


        if (!empty($keys)) {
            // 3. Delete the objects.
            $this->s3->deleteObjects([
                'Bucket'  => $bucket,
                'Delete' => [
                    'Objects' => array_map(function ($key) {
                        return ['Key' => $key['Key']];
                    }, $keys)
                ],
            ]);
        }
    }

    private function executeKeywords()
    {
        $prefix = 'keywords';
        $this->s3Clear($prefix);

        $keywords = "UNLOAD('
            -- Base adwords data with most up to date reporting
            WITH adw_base_1 AS (
                SELECT DISTINCT 
                    adgroup, 
                    day, 
                    MAX(_sdc_report_datetime) AS _sdc_report_datetime
                FROM 
                    lt__asbestoscom_google_ads.keywords_performance_report

                -- ONLY USE DATE RANGE ONCE WE DUMP ALL THE DATA INITIALLY
                WHERE day::date BETWEEN \'".$this->start."\' and \'".$this->now."\'
                -- ONLY USE DATE RANGE ONCE WE DUMP ALL THE DATA INITIALLY

                GROUP BY 1,2
            ),

            -- Get most adwords keyword data (excluding impressions)
            adwords_keyword AS (
                SELECT DISTINCT
                    B.account,
                    B.customerid, 
                    case when B.account is not null then \'AdWords\' else null end as platform,
                    B.campaignid, 
                    B.adgroupid, 
                    B.keywordid, 
                    A.adgroup, 
                    B.campaign,
                    B.keyword,
                    SUM(B.clicks) AS clicks,
                    SUM(B.cost/1000000.00) AS cost,
                    B.adgroupstate,
                    B.campaignstate,
                    B.keywordstate,
                    B.matchtype, 
                    A.day,
                    A._sdc_report_datetime,
                    MAX(B.maxcpc/1000000.00) AS maxcpc
                FROM adw_base_1 AS A
                INNER JOIN lt__asbestoscom_google_ads.keywords_performance_report AS B ON A.adgroup = B.adgroup AND A._sdc_report_datetime = B._sdc_report_datetime AND A.day = B.day
                WHERE B.campaign NOT ILIKE \'%Display%\'
                
                GROUP BY 
                    B.account,
                    B.customerid,
                    B.campaignid,
                    B.adgroupid,
                    B.keywordid, 
                    A.adgroup,
                    B.campaign, 
                    B.keyword,
                    B.adgroupstate,
                    B.campaignstate,
                    B.keywordstate,
                    B.matchtype,
                    A.day,
                    A._sdc_report_datetime
            ),

            -- Get headline impressions
            adwords_headline_impressions AS (
                SELECT DISTINCT
                    B.customerid,
                    B.campaignid,
                    B.adgroupid,
                    B.keywordid,
                    A.day,
                    SUM(B.impressions) AS impressions,
                    A._sdc_report_datetime
                FROM adw_base_1 AS A
                INNER JOIN lt__asbestoscom_google_ads.keywords_performance_report AS B ON A.adgroup = B.adgroup AND A._sdc_report_datetime = B._sdc_report_datetime AND A.day = B.day
                WHERE B.clicktype = \'Headline\'

                GROUP BY 
                    B.customerid,
                    B.campaignid,
                    B.adgroupid,
                    B.keywordid, 
                    A.day,
                    A._sdc_report_datetime
            ),

            -- Get phone impressions
            adwords_phone_impressions AS (
                SELECT DISTINCT
                    B.customerid,
                    B.campaignid,
                    B.adgroupid,
                    B.keywordid,
                    A.day,
                    SUM(B.impressions) AS impressions,
                    A._sdc_report_datetime
                FROM adw_base_1 AS A
                INNER JOIN lt__asbestoscom_google_ads.keywords_performance_report AS B ON A.adgroup = B.adgroup AND A._sdc_report_datetime = B._sdc_report_datetime AND A.day = B.day
                WHERE B.clicktype = \'Phone calls\'

                GROUP BY 
                    B.customerid,
                    B.campaignid,
                    B.adgroupid,
                    B.keywordid, 
                    A.day,
                    A._sdc_report_datetime
            ),

            -- Aggregate all adwords data together
            final_adwords AS (
                SELECT DISTINCT
                    A.account,
                    A.customerid,
                    A.platform,
                    A.campaignid,
                    A.adgroupid,
                    A.keywordid,
                    A.adgroup,
                    A.campaign,
                    A.keyword,
                    A.clicks,
                    A.cost,
                    A.adgroupstate,
                    A.campaignstate,
                    A.keywordstate,
                    A.matchtype,
                    A.day,
                    COALESCE(A.maxcpc, 0) AS maxcpc,
                    COALESCE(B.impressions, C.impressions) AS impressions

                FROM adwords_keyword as A
                LEFT JOIN adwords_headline_impressions AS B 
                ON A.campaignid = B.campaignid AND 
                    A.adgroupid = B.adgroupid AND 
                    A.keywordid = B.keywordid AND 
                    A.day = B.day
                LEFT JOIN adwords_phone_impressions AS C 
                ON A.campaignid = C.campaignid AND 
                A.adgroupid = C.adgroupid AND 
                A.keywordid = C.keywordid AND 
                A.day = C.day
            ),

            -- Get all bing keyword data
            bing_base_1 AS (
                SELECT DISTINCT 
                    timeperiod, 
                    MAX(_sdc_report_datetime) AS _sdc_report_datetime
                FROM lt__asbestoscom_bing.keyword_performance_report

                -- ONLY USE DATE RANGE ONCE WE DUMP ALL THE DATA INITIALLY
                WHERE timeperiod::date BETWEEN \'".$this->start."\' and \'".$this->now."\'
                -- ONLY USE DATE RANGE ONCE WE DUMP ALL THE DATA INITIALLY
                GROUP BY 1
            ),

            -- Get all bing keyword data
            bing_keyword AS (
                SELECT 
                    B.accountname,
                    B.accountid,
                    CASE when B.accountid is not null then \'Bing\' else null end AS platform,
                    B.campaignid,
                    B.adgroupid,
                    B.keywordid,
                    B.campaignname,
                    B.adgroupname,
                    B.keyword,
                    B.impressions AS Impressions,
                    B.clicks AS Clicks,
                    B.spend AS Cost,
                    B.adgroupstatus,
                    B.campaignstatus,
                    B.keywordstatus,
                    B.deliveredmatchtype,
                    A.timeperiod,
                    A._sdc_report_datetime
                FROM bing_base_1 AS A
                INNER JOIN lt__asbestoscom_bing.keyword_performance_report AS B ON A._sdc_report_datetime = B._sdc_report_datetime AND A.timeperiod = B.timeperiod 
            ),
            -- Join Adwords and Bing data
            joined_data as (
                -- Adwords final selection
                SELECT 
                    account,
                    customerid AS account_id,
                    platform,
                    campaignid AS campaign_id, 
                    adgroupid AS adgroup_id,
                    keywordid AS keyword_id, 
                    adgroup, 
                    campaign, 
                    keyword, 
                    COALESCE(impressions, 0) AS impressions, 
                    clicks,
                    cost, 
                    adgroupstate AS adgroup_state, 
                    campaignstate AS campaign_state, 
                    keywordstate AS keyword_state, 
                    matchtype AS match_type, 
                    day AS date, 
                    maxcpc AS max_cpc
                FROM final_adwords

                -- Append adwords final selection with Bing final selection 
                UNION ALL

                SELECT 
                    accountname,
                    accountid AS account_id, 
                    platform, 
                    campaignid AS campaign_id, 
                    adgroupid AS adgroup_id, 
                    keywordid AS keyword_id,
                    adgroupname, 
                    campaignname, 
                    keyword, 
                    impressions,
                    clicks,
                    cost,
                    adgroupstatus, 
                    campaignstatus, 
                    keywordstatus, 
                    deliveredmatchtype, 
                    timeperiod, 
                    0 AS max_cpc
                FROM bing_keyword
            )

            -- Aggregate final data
            select
            account_id,
            campaign_id, 
            adgroup_id,
            keyword_id, 
            date, 
            platform,
            account,
            adgroup, 
            campaign, 
            keyword,
            sum(impressions) AS impressions, 
            sum(clicks) as clicks,
            sum(cost) as cost,
            adgroup_state, 
            campaign_state, 
            keyword_state,  
            match_type,
            max(max_cpc) AS max_cpc
            from joined_data
            group by 1,2,3,4,5,6,7,8,9,10,14,15,16,17
        ') TO 's3://paidpal-dataloader/keywords/' iam_role 'arn:aws:iam::382977655890:role/RedShiftS3-FA' CSV";


        $sth = $this->pdo->prepare($keywords);
        $sth->execute();

    }


    private function executeCreative()
    {
        $prefix = 'creatives';
        $this->s3Clear($prefix);


        $creatives = "UNLOAD('
            -- Base adwords data with most up to date reporting
            WITH adw_base_1 AS (
                SELECT DISTINCT 
                    adgroup, 
                    day, 
                    MAX(_sdc_report_datetime) AS _sdc_report_datetime
                FROM lt__asbestoscom_google_ads.ad_performance_report

                -- ONLY USE DATE RANGE ONCE WE DUMP ALL THE DATA INITIALLY
                WHERE day::date BETWEEN \'".$this->start."\' and \'".$this->now."\'
                -- ONLY USE DATE RANGE ONCE WE DUMP ALL THE DATA INITIALLY

                GROUP BY 1,2
            ),

            -- Get most adwords keyword data (excluding impressions)
            adwords_ad AS (
                SELECT DISTINCT
                    B.account,  
                    B.customerid,
                    CASE when B.account is not null then \'AdWords\' else null end AS platform,
                    B.campaignid,
                    B.adgroupid,
                    B.adid,
                    A.adgroup,
                    B.campaign,
                    SUM(B.clicks) AS clicks,
                    SUM(B.cost/1000000.00) AS cost,
                    B.finalurl,
                    B.headline1,
                    B.headline2,
                    B.descriptionline1,
                    B.descriptionline2,  
                    B.adgroupstate,
                    B.campaignstate,
                    B.adstate,
                    A.day,
                    A._sdc_report_datetime
                FROM adw_base_1 AS A
                INNER JOIN lt__asbestoscom_google_ads.ad_performance_report AS B 
                ON A.adgroup = B.adgroup AND 
                A._sdc_report_datetime = B._sdc_report_datetime AND 
                A.day = B.day

                GROUP BY 
                    B.account,
                    B.customerid,
                    B.campaignid,
                    B.adgroupid,
                    B.adid, 
                    A.adgroup,
                    B.campaign, 
                    B.finalurl,
                    B.headline1,
                    B.headline2,
                    B.descriptionline1,
                    B.descriptionline2,
                    B.adgroupstate,
                    B.campaignstate,
                    B.adstate,
                    A.day,
                    A._sdc_report_datetime
            ),

            -- Get headline impressions
            adwords_headline_impressions AS (
                SELECT DISTINCT
                    B.customerid,
                    B.campaignid,
                    B.adgroupid,
                    B.adid,
                    A.day,
                    SUM(B.impressions) AS impressions,
                    A._sdc_report_datetime
                FROM adw_base_1 AS A
                INNER JOIN lt__asbestoscom_google_ads.ad_performance_report AS B 
                ON A.adgroup = B.adgroup AND 
                    A._sdc_report_datetime = B._sdc_report_datetime AND 
                    A.day = B.day

                WHERE B.clicktype = \'Headline\'

                GROUP BY 
                    B.customerid,
                    B.campaignid,
                    B.adgroupid,
                    B.adid, 
                    A.day,
                    A._sdc_report_datetime
            ),

            -- Get phone impressions
            adwords_phone_impressions AS (
                SELECT DISTINCT
                    B.customerid,
                    B.campaignid,
                    B.adgroupid,
                    B.adid,
                    A.day,
                    SUM(B.impressions) AS impressions,
                    A._sdc_report_datetime
                FROM adw_base_1 AS A
                INNER JOIN lt__asbestoscom_google_ads.ad_performance_report AS B 
                ON A.adgroup = B.adgroup AND 
                    A._sdc_report_datetime = B._sdc_report_datetime AND 
                    A.day = B.day
                WHERE B.clicktype = \'Phone calls\'

                GROUP BY 
                    B.customerid,
                    B.campaignid,
                    B.adgroupid,
                    B.adid, 
                    A.day,
                    A._sdc_report_datetime
            ),

            -- Aggregate all adwords data together
            final_adwords AS (
                SELECT DISTINCT
                    A.account,
                    A.customerid,
                    A.platform,
                    A.campaignid,
                    A.adgroupid,
                    A.adid,
                    A.adgroup,
                    A.campaign,
                    A.clicks,
                    A.cost,
                    A.finalurl,
                    A.headline1,
                    A.headline2,
                    A.descriptionline1,
                    A.descriptionline2,
                    A.adgroupstate,
                    A.campaignstate,
                    A.adstate,
                    A.day,
                    COALESCE(B.impressions, C.impressions) AS impressions

                FROM adwords_ad AS A
                LEFT JOIN adwords_headline_impressions AS B 
                ON A.campaignid = B.campaignid 
                AND A.adgroupid = B.adgroupid 
                AND A.adid = B.adid 
                AND A.day = B.day

                LEFT JOIN adwords_phone_impressions AS C 
                ON A.campaignid = C.campaignid 
                AND A.adgroupid = C.adgroupid 
                AND A.adid = C.adid 
                AND A.day = C.day
            ),

            -- Base bing data with most up to date reporting 
            bing_base_1 AS (
                SELECT DISTINCT 
                    timeperiod,
                    max(_sdc_report_datetime) AS _sdc_report_datetime
                FROM lt__asbestoscom_bing.ad_performance_report

                -- ONLY USE DATE RANGE ONCE WE DUMP ALL THE DATA INITIALLY
                WHERE timeperiod::date BETWEEN \'".$this->start."\' and \'".$this->now."\'
                -- ONLY USE DATE RANGE ONCE WE DUMP ALL THE DATA INITIALLY

                GROUP BY 1
            ),

            -- Get all bing keyword data
            bing_ad AS (
                SELECT 
                    B.accountname,
                    B.accountid,
                    CASE when B.accountid is not null then \'Bing\' else null end AS platform,
                    B.campaignid,
                    B.adgroupid,
                    B.adid,
                    B.campaignname,
                    B.adgroupname,
                    B.impressions AS Impressions,
                    B.clicks as Clicks,
                    B.spend as Cost,
                    B.finalurl,
                    B.titlepart1,
                    B.titlepart2,
                    B.addescription,  
                    B.adgroupstatus,
                    B.campaignstatus,
                    B.adstatus,  
                    A.timeperiod,
                    A._sdc_report_datetime
                FROM bing_base_1 as A
                INNER JOIN lt__asbestoscom_bing.ad_performance_report AS B 
                ON A._sdc_report_datetime = B._sdc_report_datetime 
                AND A.timeperiod = B.timeperiod 
            ),
            joined_data as (
                -- Adwords final selection
                SELECT 
                    account,  
                    customerid AS account_id,
                    platform,
                    campaignid AS campaign_id,
                    adgroupid AS adgroup_id,
                    adid AS creative_id,
                    adgroup,
                    campaign,
                    COALESCE(impressions, 0) AS impressions, 
                    clicks,
                    cost,
                    finalurl AS url,
                    headline1,
                    headline2,
                    descriptionline1 AS description1,
                    descriptionline2 AS description2,  
                    adgroupstate AS adgroup_state,
                    campaignstate AS campaign_state,
                    adstate AS creative_state,
                    day AS date
                FROM final_adwords

                -- Append adwords final selection with bing final selection
                UNION ALL

                SELECT
                    accountname,
                    accountid,
                    platform,
                    campaignid,
                    adgroupid,
                    adid,
                    adgroupname,
                    campaignname,
                    impressions,
                    clicks,
                    cost,
                    finalurl,
                    titlepart1,
                    titlepart2,
                    addescription,  
                    null as description2,
                    adgroupstatus,
                    campaignstatus,
                    adstatus, 
                    timeperiod
                FROM bing_ad
            )

            -- Aggregate final data
            select
            account_id,
            campaign_id,
            adgroup_id,
            creative_id,
            date,
            platform,
            account,
            adgroup,
            campaign,
            sum(impressions) as impressions, 
            sum(clicks) as clicks,
            sum(cost) as cost,
            url,
            headline1,
            headline2,
            description1,
            description2,  
            adgroup_state,
            campaign_state,
            creative_state
            from joined_data
            group by 1,2,3,4,5,6,7,8,9,13,14,15,16,17,18,19,20

        ') TO 's3://paidpal-dataloader/creatives/' iam_role 'arn:aws:iam::382977655890:role/RedShiftS3-FA' CSV";

        $sth = $this->pdo->prepare($creatives);
        $sth->execute();

    }

    private function executeAsbestos()
    {
        $prefix = 'asbestos_leads';
        $this->s3Clear($prefix);

        $leads = "UNLOAD('WITH mds AS (
            SELECT DISTINCT 
                \"Marketing Data C\".id AS md_id,
                redis_id__c,
                createddate AS md_createddatetime,
                CASE when id is not null then 1 else null end AS mds,
                \"Marketing Data C\".adwords_campaign__c AS campaign__c,
                \"Marketing Data C\".adwords_adgroup__c as adgroup__c,
                \"Marketing Data C\".keyword_id__c as keyword__c,
                \"Marketing Data C\".adwords_creative__c as creative__c,
                CASE \"Marketing Data C\".utm_source__c
                    WHEN \'google\' THEN \'AdWords\'
                    WHEN \'adwords\' THEN \'AdWords\'
                    WHEN \'bing\' THEN \'Bing\'
                    WHEN \'facebook\' THEN \'Facebook\'
                ELSE \"Marketing Data C\".utm_source__c end AS source
            FROM
                lt_pa_salesforce.marketing_data__c AS \"Marketing Data C\" 
            WHERE
                \"Marketing Data C\".vertical__c IN (\'Asbestos\')
                AND utm_source__c in (\'google\', \'adwords\', \'bing\', \'facebook\')      
                AND \"Marketing Data C\".createddate::date > \'2016-12-31\'   
                AND \"Marketing Data C\".source__c ILIKE \'%Asbestos%\'  
                AND test_or_spam__c IS false   
                AND paid__c IS true
        ),

        leads AS (     
            SELECT DISTINCT 
                lead.marketing_data_attribution__c AS md_id,
                CASE when Lead.marketing_data_attribution__c IS not null then 1 else null end AS leads
            FROM
                lt_pa_salesforce.lead AS Lead 
                INNER JOIN mds on Lead.marketing_data_attribution__c = mds.md_id
            WHERE
                Lead.md_vertical__c IN (\'Asbestos\')        
                AND Lead.test_or_spam__c IS FALSE        
                AND Lead.source__c ILIKE \'%Asbestos%\' 
                AND Lead.source__c NOT ILIKE \'%PA%DID%\'
                AND Lead.parent_campaign_name__c ILIKE \'%paid%\'  
                AND Lead.createddate::date > \'2016-12-31\'

        ),     

        meso_form_leads AS ( 
            SELECT DISTINCT
                lead.marketing_data_attribution__c AS md_id,
                CASE when Lead.marketing_data_attribution__c is not null then 1 else null end AS meso_form_leads
            FROM
                lt_pa_salesforce.lead AS Lead  
                INNER JOIN mds AS mds ON Lead.marketing_data_attribution__c = mds.md_id
            WHERE
                Lead.md_vertical__c IN (\'Asbestos\')        
                AND Lead.test_or_spam__c IS FALSE        
                AND Lead.source__c ILIKE \'%Asbestos%\' 
                AND Lead.createddate::date > \'2016-12-31\'
                AND lead.effect__c ILIKE \'%Mesothelioma%\'  
                AND lead.parent_campaign_name__c ILIKE \'%paid%\'   
                AND lead.marketing_data_type__c IN (\'Form\')  
                AND Lead.source__c NOT ILIKE \'%PA%DID%\'
        ),

        accounts AS (   
            SELECT DISTINCT
                lead.marketing_data_attribution__c AS md_id,
                CASE when Lead.marketing_data_attribution__c is not null then 1 else null end AS accounts
            FROM
                lt_pa_salesforce.account AS Account 
                INNER JOIN lt_pa_salesforce.lead AS Lead ON account.lead_attribution__c = lead.id
                INNER JOIN mds ON lead.marketing_data_attribution__c = mds.md_id
            WHERE 
                account.parent_campaign_name__c ILIKE \'%paid%\'   
                AND account.test__c IS false 
                AND account.createddate::date > \'2016-08-01\'
                AND lead.source__c ILIKE \'%Asbestos%\' 
        ),   

        meso_accounts AS (   
            SELECT DISTINCT 
                lead.marketing_data_attribution__c AS md_id,
                CASE when Lead.marketing_data_attribution__c is not null then 1 else null end AS meso_accounts
            FROM
                lt_pa_salesforce.account AS Account
                INNER JOIN lt_pa_salesforce.lead AS Lead ON account.lead_attribution__c = lead.id
                INNER JOIN mds ON lead.marketing_data_attribution__c = mds.md_id
            WHERE 
                account.parent_campaign_name__c ILIKE \'%paid%\'
                AND account.effect__c ILIKE \'%Mesothelioma%\'    
                AND account.test__c IS false
                AND account.createddate::date > \'2016-08-01\'
                AND lead.source__c ILIKE \'%Asbestos%\' 
        ),

        qualified_leads AS (
            SELECT DISTINCT
                lead.marketing_data_attribution__c AS md_id,
                CASE when Lead.marketing_data_attribution__c IS not null then 1 else null end AS qualified_leads
            FROM
                lt_pa_salesforce.account AS Account 
                INNER JOIN lt_pa_salesforce.lead AS Lead ON account.lead_attribution__c = lead.id
                INNER JOIN mds ON lead.marketing_data_attribution__c = mds.md_id
            WHERE
                Account.u_s_exposure__c IN (\'Yes\', \'Unknown\')        
                AND Account.currently_represented__c IN (\'Unknown\',\'No\', \'Yes, after arrival\')        
                AND Account.effect__c ILIKE \'%Mesothelioma%\'   
                and Account.createddate::date > \'2016-08-01\'
                AND Account.parent_campaign_name__c ILIKE \'%PAID%\'
                AND lead.source__c ILIKE \'%Asbestos%\'
        ),

        viables AS (
            SELECT DISTINCT
                lead.marketing_data_attribution__c AS md_id,
                CASE when Lead.marketing_data_attribution__c is not null then 1 else null end AS viables
            FROM
                lt_pa_salesforce.account AS Account
                INNER JOIN lt_pa_salesforce.lead AS Lead ON account.lead_attribution__c = lead.id
                INNER JOIN mds ON lead.marketing_data_attribution__c = mds.md_id
            WHERE 
                (Account.viable_rollback__c IS false
                AND Account.first_viable_date__c IS NOT NULL
                AND Account.parent_campaign_name__c ILIKE \'%PAID%\'
                AND Account.createddate::date > \'2016-08-01\'
                AND lead.source__c ILIKE \'%Asbestos%\')
        ),

        acct_sendovers AS (
            SELECT DISTINCT 
                lead.marketing_data_attribution__c AS md_id,
                CASE when Lead.marketing_data_attribution__c is not null then 1 else null end AS acct_sendovers
            FROM 
                lt_pa_salesforce.account AS Account
                INNER JOIN lt_pa_salesforce.lead AS Lead ON account.lead_attribution__c = lead.id
                INNER JOIN mds ON lead.marketing_data_attribution__c = mds.md_id
                INNER JOIN lt_pa_salesforce.opportunity AS Opportunity ON account.id = opportunity.accountid
            WHERE
                Account.parent_campaign_name__c ILIKE \'%paid%\'
                AND Account.u_s_exposure__c = \'Yes\'
                AND Account.opportunity__c IS NOT NULL
                AND Opportunity.stage_sendover_date_time__c IS NOT NULL
                AND Opportunity.effect__c ILIKE \'%Mesothelioma%\'
                AND Account.within_statute_of_limitations__c = \'Yes\'
                AND Account.currently_represented__c IN (\'No\', \'Yes, after arrival\')
                AND account.createddate::date > \'2016-08-01\'
                AND lead.source__c ILIKE \'%Asbestos%\'
        ),

        acct_meetings_scheduled AS (
            SELECT DISTINCT
                lead.marketing_data_attribution__c AS md_id,
                CASE when Lead.marketing_data_attribution__c is not null then 1 else null end AS acct_meetings_scheduled
            FROM 
                lt_pa_salesforce.account AS Account
                INNER JOIN lt_pa_salesforce.lead AS Lead ON account.lead_attribution__c = lead.id
                INNER JOIN mds ON lead.marketing_data_attribution__c = mds.md_id
                INNER JOIN lt_pa_salesforce.opportunity as Opportunity ON account.id = opportunity.accountid
            WHERE 
                Account.effect__c ILIKE \'%Mesothelioma%\' 
                AND Account.u_s_exposure__c = \'Yes\'
                AND Account.parent_campaign_name__c ILIKE \'%paid%\'  
                AND Opportunity.stage_meeting_scheduled_date_time__c IS not null  
                AND Account.within_statute_of_limitations__c = \'Yes\'
                AND Account.currently_represented__c IN (\'No\', \'Yes, after arrival\')
                AND account.createddate::date > \'2016-08-01\'
                AND lead.source__c ILIKE \'%Asbestos%\'
        ),

        customers_setup As (
            SELECT DISTINCT
                lead.marketing_data_attribution__c AS md_id,
                COALESCE(Opportunity.signing_value_override__c,Opportunity.signing_value__c) AS customers
            FROM 
                lt_pa_salesforce.account AS Account
                INNER JOIN lt_pa_salesforce.lead AS Lead ON account.lead_attribution__c = lead.id
                INNER JOIN mds ON lead.marketing_data_attribution__c = mds.md_id
                INNER JOIN lt_pa_salesforce.opportunity as Opportunity ON account.id = opportunity.accountid
            WHERE 
                Account.effect__c = \'Mesothelioma\'
                AND Account.parent_campaign_name__c ILIKE \'%paid%\'
                AND Opportunity.stage_signed_date_time__c is not null
                AND account.createddate::date > \'2016-08-01\'
                AND lead.source__c ILIKE \'%Asbestos%\'
        ),

        customers AS (
            SELECT DISTINCT
                md_id,
                customers
            FROM
                customers_setup
            WHERE
                customers > 0
            )

        SELECT DISTINCT
            A.md_id,
            A.redis_id__c AS lead_id,
            A.md_createddatetime::timestamp AS date,
            A.campaign__c::varchar AS campaign_id,
            A.adgroup__c::varchar AS adgroup_id,
            A.keyword__c::varchar AS keyword_id,
            A.creative__c::varchar AS creative_id,
            COALESCE(A.mds,0)::int2 AS is_md,
            COALESCE(B.leads,0)::int2 AS is_lead,
            COALESCE(C.meso_form_leads,0)::int2 AS is_meso_form_lead,
            COALESCE(D.accounts,0)::int2 AS is_account,
            COALESCE(E.meso_accounts, 0)::int2 AS is_meso_account,
            COALESCE(F.qualified_leads,0)::int2 AS is_qualified_lead,
            COALESCE(G.viables,0)::int2 AS is_viable,
            COALESCE(H.acct_sendovers,0)::int2 AS is_account_sendover,
            COALESCE(I.acct_meetings_scheduled,0)::int2 As is_account_meeting,
            COALESCE(J.customers,0)::decimal(4,2) AS is_customer,
            A.source::varchar

        FROM mds AS A
            LEFT JOIN leads AS B ON A.md_id = B.md_id
            LEFT JOIN meso_form_leads AS C ON A.md_id = C.md_id
            LEFT JOIN accounts AS D ON A.md_id = D.md_id
            LEFT JOIN meso_accounts AS E ON A.md_id = E.md_id
            LEFT JOIN qualified_leads AS F ON A.md_id = F.md_id
            LEFT JOIN viables AS G ON A.md_id = G.md_id
            LEFT JOIN acct_sendovers AS H ON A.md_id = H.md_id
            LEFT JOIN acct_meetings_scheduled AS I ON A.md_id = I.md_id
            LEFT JOIN customers AS J ON A.md_id = J.md_id

        ') TO 's3://paidpal-dataloader/asbestos_leads/' iam_role 'arn:aws:iam::382977655890:role/RedShiftS3-FA' CSV";

        $sth = $this->pdo->prepare($leads);
        $sth->execute();

    }

}
