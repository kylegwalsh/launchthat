<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20190328144440 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE campaign_data_fields DROP FOREIGN KEY campaignData_campaignDataFields');
        $this->addSql('ALTER TABLE campaign_data_map DROP FOREIGN KEY campaignData_campaignDataMap');
        $this->addSql('CREATE TABLE campaign_attribution (id INT UNSIGNED AUTO_INCREMENT NOT NULL, campaign_id INT UNSIGNED DEFAULT NULL, route_id INT UNSIGNED DEFAULT NULL, created_at DATETIME NOT NULL, updated_at DATETIME NOT NULL, is_paid TINYINT(1) NOT NULL, INDEX route_campaignAttribution (route_id), INDEX campaign_campaignAttribution (campaign_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE campaign_attribution_fields (id INT UNSIGNED AUTO_INCREMENT NOT NULL, campaign_attribution_id INT UNSIGNED DEFAULT NULL, route_field_id INT UNSIGNED DEFAULT NULL, created_at DATETIME NOT NULL, updated_at DATETIME NOT NULL, value VARCHAR(255) DEFAULT NULL, INDEX campaignAttribution_campaignAttributionFields (campaign_attribution_id), INDEX routeField_campaignAttributionField (route_field_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('ALTER TABLE campaign_attribution ADD CONSTRAINT FK_1F9BD1B3F639F774 FOREIGN KEY (campaign_id) REFERENCES campaigns (id)');
        $this->addSql('ALTER TABLE campaign_attribution ADD CONSTRAINT FK_1F9BD1B334ECB4E6 FOREIGN KEY (route_id) REFERENCES routes (id)');
        $this->addSql('ALTER TABLE campaign_attribution_fields ADD CONSTRAINT FK_E185CF745EA73BF4 FOREIGN KEY (campaign_attribution_id) REFERENCES campaign_attribution (id)');
        $this->addSql('ALTER TABLE campaign_attribution_fields ADD CONSTRAINT FK_E185CF74BA1B4F9B FOREIGN KEY (route_field_id) REFERENCES route_fields (id)');
        $this->addSql('DROP TABLE campaign_data');
        $this->addSql('DROP TABLE campaign_data_fields');
        $this->addSql('DROP TABLE campaign_data_map');
        $this->addSql('ALTER TABLE campaigns DROP FOREIGN KEY verticals_campaigns');
        $this->addSql('ALTER TABLE campaigns CHANGE vertical_id vertical_id INT UNSIGNED DEFAULT NULL, CHANGE name name VARCHAR(255) NOT NULL, CHANGE description description VARCHAR(510) NOT NULL');
        $this->addSql('ALTER TABLE campaigns ADD CONSTRAINT FK_E3737470607DECF7 FOREIGN KEY (vertical_id) REFERENCES verticals (id)');
        $this->addSql('ALTER TABLE fields CHANGE name name VARCHAR(255) NOT NULL');
        $this->addSql('ALTER TABLE route_fields DROP FOREIGN KEY field_routeFields');
        $this->addSql('ALTER TABLE route_fields DROP FOREIGN KEY route_routeFIelds');
        $this->addSql('ALTER TABLE route_fields CHANGE field_id field_id INT UNSIGNED DEFAULT NULL, CHANGE route_id route_id INT UNSIGNED DEFAULT NULL');
        $this->addSql('ALTER TABLE route_fields ADD CONSTRAINT FK_4F161255443707B0 FOREIGN KEY (field_id) REFERENCES fields (id)');
        $this->addSql('ALTER TABLE route_fields ADD CONSTRAINT FK_4F16125534ECB4E6 FOREIGN KEY (route_id) REFERENCES routes (id)');
        $this->addSql('ALTER TABLE routes CHANGE name name VARCHAR(255) NOT NULL, CHANGE description description VARCHAR(510) NOT NULL');
        $this->addSql('ALTER TABLE sites CHANGE name name VARCHAR(255) NOT NULL, CHANGE active active TINYINT(1) NOT NULL, CHANGE domain domain VARCHAR(255) NOT NULL, CHANGE webmaster_email webmaster_email VARCHAR(255) DEFAULT NULL');
        $this->addSql('ALTER TABLE verticals CHANGE name name VARCHAR(255) NOT NULL, CHANGE lead_email lead_email VARCHAR(255) NOT NULL, CHANGE lead_email_test lead_email_test VARCHAR(255) NOT NULL, CHANGE lead_slack lead_slack VARCHAR(255) NOT NULL, CHANGE lead_slack_test lead_slack_test VARCHAR(255) NOT NULL, CHANGE description description VARCHAR(510) NOT NULL');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE campaign_attribution_fields DROP FOREIGN KEY FK_E185CF745EA73BF4');
        $this->addSql('CREATE TABLE campaign_data (id INT UNSIGNED AUTO_INCREMENT NOT NULL, route_id INT UNSIGNED NOT NULL, created_at DATETIME NOT NULL, updated_at DATETIME NOT NULL, INDEX route_campaignData (route_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('CREATE TABLE campaign_data_fields (id INT UNSIGNED AUTO_INCREMENT NOT NULL, campaign_data_id INT UNSIGNED NOT NULL, field_id INT UNSIGNED DEFAULT NULL, route_field_id INT UNSIGNED DEFAULT NULL, created_at DATETIME NOT NULL, updated_at DATETIME NOT NULL, value VARCHAR(255) DEFAULT NULL COLLATE latin1_swedish_ci, INDEX field_campaignDataFields (field_id), INDEX routeField_campaignDataField (route_field_id), INDEX campaignData_campaignDataFields (campaign_data_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('CREATE TABLE campaign_data_map (id INT UNSIGNED AUTO_INCREMENT NOT NULL, campaign_id INT UNSIGNED NOT NULL, campaign_data_id INT UNSIGNED NOT NULL, created_at DATETIME NOT NULL, updated_at DATETIME NOT NULL, attribution VARCHAR(255) DEFAULT \'\' NOT NULL COLLATE latin1_swedish_ci, INDEX campaign_campaignDataMap (campaign_id), INDEX campaignData_campaignDataMap (campaign_data_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('ALTER TABLE campaign_data ADD CONSTRAINT route_campaignData FOREIGN KEY (route_id) REFERENCES routes (id) ON UPDATE CASCADE');
        $this->addSql('ALTER TABLE campaign_data_fields ADD CONSTRAINT campaignData_campaignDataFields FOREIGN KEY (campaign_data_id) REFERENCES campaign_data (id) ON UPDATE CASCADE ON DELETE CASCADE');
        $this->addSql('ALTER TABLE campaign_data_fields ADD CONSTRAINT field_campaignDataFields FOREIGN KEY (field_id) REFERENCES fields (id) ON UPDATE CASCADE ON DELETE CASCADE');
        $this->addSql('ALTER TABLE campaign_data_fields ADD CONSTRAINT routeField_campaignDataField FOREIGN KEY (route_field_id) REFERENCES route_fields (id) ON UPDATE CASCADE ON DELETE CASCADE');
        $this->addSql('ALTER TABLE campaign_data_map ADD CONSTRAINT campaignData_campaignDataMap FOREIGN KEY (campaign_data_id) REFERENCES campaign_data (id) ON UPDATE CASCADE');
        $this->addSql('ALTER TABLE campaign_data_map ADD CONSTRAINT campaign_campaignDataMap FOREIGN KEY (campaign_id) REFERENCES campaigns (id) ON UPDATE CASCADE ON DELETE CASCADE');
        $this->addSql('DROP TABLE campaign_attribution');
        $this->addSql('DROP TABLE campaign_attribution_fields');
        $this->addSql('ALTER TABLE campaigns DROP FOREIGN KEY FK_E3737470607DECF7');
        $this->addSql('ALTER TABLE campaigns CHANGE vertical_id vertical_id INT UNSIGNED NOT NULL, CHANGE name name VARCHAR(255) DEFAULT \'\' NOT NULL COLLATE latin1_swedish_ci, CHANGE description description VARCHAR(510) DEFAULT \'\' NOT NULL COLLATE latin1_swedish_ci');
        $this->addSql('ALTER TABLE campaigns ADD CONSTRAINT verticals_campaigns FOREIGN KEY (vertical_id) REFERENCES verticals (id) ON UPDATE CASCADE');
        $this->addSql('ALTER TABLE fields CHANGE name name VARCHAR(255) DEFAULT \'\' NOT NULL COLLATE latin1_swedish_ci');
        $this->addSql('ALTER TABLE route_fields DROP FOREIGN KEY FK_4F161255443707B0');
        $this->addSql('ALTER TABLE route_fields DROP FOREIGN KEY FK_4F16125534ECB4E6');
        $this->addSql('ALTER TABLE route_fields CHANGE field_id field_id INT UNSIGNED NOT NULL, CHANGE route_id route_id INT UNSIGNED NOT NULL');
        $this->addSql('ALTER TABLE route_fields ADD CONSTRAINT field_routeFields FOREIGN KEY (field_id) REFERENCES fields (id) ON UPDATE CASCADE ON DELETE CASCADE');
        $this->addSql('ALTER TABLE route_fields ADD CONSTRAINT route_routeFIelds FOREIGN KEY (route_id) REFERENCES routes (id) ON UPDATE CASCADE ON DELETE CASCADE');
        $this->addSql('ALTER TABLE routes CHANGE name name VARCHAR(255) DEFAULT \'\' NOT NULL COLLATE latin1_swedish_ci, CHANGE description description VARCHAR(510) DEFAULT \'\' NOT NULL COLLATE latin1_swedish_ci');
        $this->addSql('ALTER TABLE sites CHANGE name name VARCHAR(255) DEFAULT \'\' NOT NULL COLLATE latin1_swedish_ci, CHANGE active active TINYINT(1) DEFAULT \'0\' NOT NULL, CHANGE domain domain VARCHAR(255) DEFAULT \'\' NOT NULL COLLATE latin1_swedish_ci, CHANGE webmaster_email webmaster_email VARCHAR(255) NOT NULL COLLATE latin1_swedish_ci');
        $this->addSql('ALTER TABLE verticals CHANGE name name VARCHAR(255) DEFAULT \'\' NOT NULL COLLATE latin1_swedish_ci, CHANGE lead_email lead_email VARCHAR(255) DEFAULT \'\' NOT NULL COLLATE latin1_swedish_ci, CHANGE lead_email_test lead_email_test VARCHAR(255) DEFAULT \'\' NOT NULL COLLATE latin1_swedish_ci, CHANGE lead_slack lead_slack VARCHAR(255) DEFAULT \'\' NOT NULL COLLATE latin1_swedish_ci, CHANGE lead_slack_test lead_slack_test VARCHAR(255) DEFAULT \'\' NOT NULL COLLATE latin1_swedish_ci, CHANGE description description VARCHAR(510) DEFAULT \'\' NOT NULL COLLATE latin1_swedish_ci');
    }
}
