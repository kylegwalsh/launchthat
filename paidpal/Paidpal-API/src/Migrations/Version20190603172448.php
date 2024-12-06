<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20190603172448 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('CREATE TABLE keywords (id INT NOT NULL, account_id INT NOT NULL, campaign_id INT NOT NULL, adgroup_id INT NOT NULL, keyword_id INT NOT NULL, date DATETIME NOT NULL, platform VARCHAR(255) DEFAULT NULL, account VARCHAR(255) DEFAULT NULL, adgroup VARCHAR(255) DEFAULT NULL, campaign VARCHAR(255) DEFAULT NULL, keyword VARCHAR(255) DEFAULT NULL, impressions INT DEFAULT NULL, clicks INT DEFAULT NULL, cost NUMERIC(10, 2) DEFAULT NULL, adgroup_state VARCHAR(255) DEFAULT NULL, campaign_state VARCHAR(255) DEFAULT NULL, keyword_state VARCHAR(255) DEFAULT NULL, match_type VARCHAR(255) DEFAULT NULL, click_type VARCHAR(255) DEFAULT NULL, max_cpc NUMERIC(10, 2) DEFAULT NULL, PRIMARY KEY(id, account_id, campaign_id, adgroup_id, keyword_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('DROP TABLE keywords');
    }
}
