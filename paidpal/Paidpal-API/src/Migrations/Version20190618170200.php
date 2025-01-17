<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20190618170200 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE creatives DROP PRIMARY KEY');
        $this->addSql('ALTER TABLE creatives CHANGE platform platform VARCHAR(255) NOT NULL');
        $this->addSql('ALTER TABLE creatives ADD PRIMARY KEY (account_id, campaign_id, adgroup_id, creative_id, date, platform)');
        $this->addSql('ALTER TABLE keywords DROP PRIMARY KEY');
        $this->addSql('ALTER TABLE keywords CHANGE platform platform VARCHAR(255) NOT NULL');
        $this->addSql('ALTER TABLE keywords ADD PRIMARY KEY (account_id, campaign_id, adgroup_id, keyword_id, date, match_type, platform)');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE creatives DROP PRIMARY KEY');
        $this->addSql('ALTER TABLE creatives CHANGE platform platform VARCHAR(255) DEFAULT NULL COLLATE utf8mb4_unicode_ci');
        $this->addSql('ALTER TABLE creatives ADD PRIMARY KEY (account_id, campaign_id, adgroup_id, creative_id, date)');
        $this->addSql('ALTER TABLE keywords DROP PRIMARY KEY');
        $this->addSql('ALTER TABLE keywords CHANGE platform platform VARCHAR(255) DEFAULT NULL COLLATE utf8mb4_unicode_ci');
        $this->addSql('ALTER TABLE keywords ADD PRIMARY KEY (account_id, campaign_id, adgroup_id, keyword_id, date, match_type)');
    }
}
