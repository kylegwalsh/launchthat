<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20190604144450 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('CREATE TABLE creatives (account_id INT NOT NULL, campaign_id INT NOT NULL, adgroup_id INT NOT NULL, creative_id INT NOT NULL, date DATETIME NOT NULL, platform VARCHAR(255) DEFAULT NULL, account VARCHAR(255) DEFAULT NULL, adgroup VARCHAR(255) DEFAULT NULL, campaign VARCHAR(255) DEFAULT NULL, impressions INT DEFAULT NULL, clicks INT DEFAULT NULL, cost NUMERIC(10, 2) DEFAULT NULL, url VARCHAR(255) DEFAULT NULL, headline1 VARCHAR(255) DEFAULT NULL, headline2 VARCHAR(255) DEFAULT NULL, description1 VARCHAR(255) DEFAULT NULL, description2 VARCHAR(255) DEFAULT NULL, adgroup_state VARCHAR(255) DEFAULT NULL, campaign_state VARCHAR(255) DEFAULT NULL, creative_state VARCHAR(255) DEFAULT NULL, click_type VARCHAR(255) DEFAULT NULL, PRIMARY KEY(account_id, campaign_id, adgroup_id, creative_id, date)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('DROP TABLE ads');
        $this->addSql('ALTER TABLE keywords DROP PRIMARY KEY');
        $this->addSql('ALTER TABLE keywords DROP id');
        $this->addSql('ALTER TABLE keywords ADD PRIMARY KEY (account_id, campaign_id, adgroup_id, keyword_id, date)');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('CREATE TABLE ads (id INT NOT NULL, account_id INT NOT NULL, campaign_id INT NOT NULL, adgroup_id INT NOT NULL, creative_id INT NOT NULL, date DATETIME NOT NULL, platform VARCHAR(255) DEFAULT NULL COLLATE utf8mb4_unicode_ci, account VARCHAR(255) DEFAULT NULL COLLATE utf8mb4_unicode_ci, adgroup VARCHAR(255) DEFAULT NULL COLLATE utf8mb4_unicode_ci, campaign VARCHAR(255) DEFAULT NULL COLLATE utf8mb4_unicode_ci, impressions INT DEFAULT NULL, clicks INT DEFAULT NULL, cost NUMERIC(10, 2) DEFAULT NULL, url VARCHAR(255) DEFAULT NULL COLLATE utf8mb4_unicode_ci, headline1 VARCHAR(255) DEFAULT NULL COLLATE utf8mb4_unicode_ci, headline2 VARCHAR(255) DEFAULT NULL COLLATE utf8mb4_unicode_ci, description1 VARCHAR(255) DEFAULT NULL COLLATE utf8mb4_unicode_ci, description2 VARCHAR(255) DEFAULT NULL COLLATE utf8mb4_unicode_ci, adgroup_state VARCHAR(255) DEFAULT NULL COLLATE utf8mb4_unicode_ci, campaign_state VARCHAR(255) DEFAULT NULL COLLATE utf8mb4_unicode_ci, creative_state VARCHAR(255) DEFAULT NULL COLLATE utf8mb4_unicode_ci, click_type VARCHAR(255) DEFAULT NULL COLLATE utf8mb4_unicode_ci, PRIMARY KEY(id, account_id, campaign_id, adgroup_id, creative_id, date)) DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('DROP TABLE creatives');
        $this->addSql('ALTER TABLE keywords DROP PRIMARY KEY');
        $this->addSql('ALTER TABLE keywords ADD id INT NOT NULL');
        $this->addSql('ALTER TABLE keywords ADD PRIMARY KEY (id, account_id, campaign_id, adgroup_id, keyword_id)');
    }
}