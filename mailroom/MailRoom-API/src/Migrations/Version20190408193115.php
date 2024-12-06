<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20190408193115 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE response_records DROP FOREIGN KEY FK_37271E3855458D');
        $this->addSql('DROP INDEX leads_responseRecords ON response_records');
        $this->addSql('ALTER TABLE leads MODIFY id INT UNSIGNED NOT NULL');
        $this->addSql('ALTER TABLE leads DROP PRIMARY KEY');
        $this->addSql('ALTER TABLE leads ADD version INT UNSIGNED DEFAULT 1 NOT NULL, CHANGE id id INT UNSIGNED NOT NULL');
        $this->addSql('ALTER TABLE leads ADD PRIMARY KEY (id, version)');
        $this->addSql('ALTER TABLE response_records ADD lead_version INT UNSIGNED DEFAULT 1 NOT NULL, CHANGE lead_id lead_id INT UNSIGNED NOT NULL');
        $this->addSql('CREATE INDEX IDX_37271E3855458DE6D28FAD ON response_records (lead_id, lead_version)');
        $this->addSql('ALTER TABLE response_records ADD CONSTRAINT FK_37271E3855458DE6D28FAD FOREIGN KEY (lead_id, lead_version) REFERENCES leads (id, version) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE email_endpoints CHANGE recipient recipient VARCHAR(255) NOT NULL');    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE email_endpoints CHANGE recipient recipient VARCHAR(255) DEFAULT \'\' NOT NULL COLLATE latin1_swedish_ci');
        $this->addSql('ALTER TABLE response_records DROP FOREIGN KEY FK_37271E3855458DE6D28FAD');
        $this->addSql('DROP INDEX IDX_37271E3855458DE6D28FAD ON response_records');
        $this->addSql('ALTER TABLE response_records DROP lead_version, CHANGE lead_id lead_id INT UNSIGNED DEFAULT NULL');
        $this->addSql('ALTER TABLE leads DROP PRIMARY KEY');
        $this->addSql('ALTER TABLE leads DROP version');
        $this->addSql('ALTER TABLE leads ADD PRIMARY KEY (id)');
        $this->addSql('ALTER TABLE leads CHANGE id id INT UNSIGNED AUTO_INCREMENT NOT NULL');
        $this->addSql('CREATE INDEX leads_responseRecords ON response_records (lead_id)');
        $this->addSql('ALTER TABLE response_records ADD CONSTRAINT FK_37271E3855458D FOREIGN KEY (lead_id) REFERENCES leads (id)');
    }
}
