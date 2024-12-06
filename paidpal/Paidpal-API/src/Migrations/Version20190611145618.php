<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20190611145618 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE asbestos_leads CHANGE is_md is_md SMALLINT DEFAULT NULL, CHANGE is_lead is_lead SMALLINT DEFAULT NULL, CHANGE is_meso_form_lead is_meso_form_lead SMALLINT DEFAULT NULL, CHANGE is_account is_account SMALLINT DEFAULT NULL, CHANGE is_meso_account is_meso_account SMALLINT DEFAULT NULL, CHANGE is_qualified_lead is_qualified_lead SMALLINT DEFAULT NULL, CHANGE is_account_sendover is_account_sendover SMALLINT DEFAULT NULL, CHANGE is_account_meeting is_account_meeting SMALLINT DEFAULT NULL, CHANGE is_customer is_customer NUMERIC(10, 2) DEFAULT NULL, CHANGE is_viable is_viable SMALLINT DEFAULT NULL');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE asbestos_leads CHANGE is_md is_md TINYINT(1) DEFAULT NULL, CHANGE is_lead is_lead TINYINT(1) DEFAULT NULL, CHANGE is_meso_form_lead is_meso_form_lead TINYINT(1) NOT NULL, CHANGE is_account is_account TINYINT(1) DEFAULT NULL, CHANGE is_meso_account is_meso_account TINYINT(1) DEFAULT NULL, CHANGE is_qualified_lead is_qualified_lead TINYINT(1) DEFAULT NULL, CHANGE is_account_sendover is_account_sendover TINYINT(1) DEFAULT NULL, CHANGE is_account_meeting is_account_meeting TINYINT(1) DEFAULT NULL, CHANGE is_customer is_customer TINYINT(1) DEFAULT NULL, CHANGE is_viable is_viable TINYINT(1) DEFAULT NULL');
    }
}
