<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20190604154534 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE creatives CHANGE account_id account_id BIGINT NOT NULL, CHANGE campaign_id campaign_id BIGINT NOT NULL, CHANGE adgroup_id adgroup_id BIGINT NOT NULL, CHANGE creative_id creative_id BIGINT NOT NULL');
        $this->addSql('ALTER TABLE keywords CHANGE account_id account_id BIGINT NOT NULL, CHANGE campaign_id campaign_id BIGINT NOT NULL, CHANGE adgroup_id adgroup_id BIGINT NOT NULL, CHANGE keyword_id keyword_id BIGINT NOT NULL');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE creatives CHANGE account_id account_id INT UNSIGNED NOT NULL, CHANGE campaign_id campaign_id INT NOT NULL, CHANGE adgroup_id adgroup_id INT NOT NULL, CHANGE creative_id creative_id INT NOT NULL');
        $this->addSql('ALTER TABLE keywords CHANGE account_id account_id INT UNSIGNED NOT NULL, CHANGE campaign_id campaign_id INT NOT NULL, CHANGE adgroup_id adgroup_id INT NOT NULL, CHANGE keyword_id keyword_id INT NOT NULL');
    }
}
