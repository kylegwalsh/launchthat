<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20190613174527 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('CREATE TABLE keyword_result (id INT AUTO_INCREMENT NOT NULL, account VARCHAR(255) DEFAULT NULL, account_id INT NOT NULL, campaign VARCHAR(255) NOT NULL, campaign_id INT NOT NULL, adgroup VARCHAR(255) NOT NULL, adgroup_id INT NOT NULL, keyword VARCHAR(255) NOT NULL, keyword_id INT NOT NULL, platform VARCHAR(255) NOT NULL, match_type VARCHAR(255) NOT NULL, keyword_state VARCHAR(255) NOT NULL, impressions INT NOT NULL, clicks INT NOT NULL, cost NUMERIC(10, 0) NOT NULL, ctr NUMERIC(10, 0) NOT NULL, cpc NUMERIC(10, 0) NOT NULL, max_cpc NUMERIC(10, 0) NOT NULL, mds INT NOT NULL, cpmd NUMERIC(10, 0) NOT NULL, leads INT NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('ALTER TABLE keywords DROP PRIMARY KEY');
        $this->addSql('ALTER TABLE keywords CHANGE match_type match_type VARCHAR(255) NOT NULL');
        $this->addSql('ALTER TABLE keywords ADD PRIMARY KEY (account_id, campaign_id, adgroup_id, keyword_id, date, match_type)');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('DROP TABLE keyword_result');
        $this->addSql('ALTER TABLE keywords DROP PRIMARY KEY');
        $this->addSql('ALTER TABLE keywords CHANGE match_type match_type VARCHAR(255) DEFAULT NULL COLLATE utf8mb4_unicode_ci');
        $this->addSql('ALTER TABLE keywords ADD PRIMARY KEY (account_id, campaign_id, adgroup_id, keyword_id, date)');
    }
}
