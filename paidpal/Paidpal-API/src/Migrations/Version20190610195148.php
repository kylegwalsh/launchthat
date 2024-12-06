<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20190610195148 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE asbestos_leads CHANGE lead_id lead_id VARCHAR(255) DEFAULT NULL, CHANGE campaign_id campaign_id VARCHAR(255) DEFAULT NULL, CHANGE adgroup_id adgroup_id VARCHAR(255) DEFAULT NULL, CHANGE keyword_id keyword_id VARCHAR(255) DEFAULT NULL, CHANGE creative_id creative_id VARCHAR(255) DEFAULT NULL');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE asbestos_leads CHANGE lead_id lead_id INT DEFAULT NULL, CHANGE campaign_id campaign_id BIGINT DEFAULT NULL, CHANGE adgroup_id adgroup_id BIGINT DEFAULT NULL, CHANGE keyword_id keyword_id BIGINT DEFAULT NULL, CHANGE creative_id creative_id BIGINT DEFAULT NULL');
    }
}
