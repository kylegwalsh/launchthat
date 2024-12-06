<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20190606193856 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE asbestos_leads ADD is_qualified_account TINYINT(1) DEFAULT NULL, ADD is_viable TINYINT(1) DEFAULT NULL');
        $this->addSql('ALTER TABLE creatives DROP click_type, CHANGE url url LONGTEXT DEFAULT NULL');
        $this->addSql('ALTER TABLE keywords DROP click_type');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE asbestos_leads DROP is_qualified_account, DROP is_viable');
        $this->addSql('ALTER TABLE creatives ADD click_type VARCHAR(255) DEFAULT NULL COLLATE utf8mb4_unicode_ci, CHANGE url url VARCHAR(255) DEFAULT NULL COLLATE utf8mb4_unicode_ci');
        $this->addSql('ALTER TABLE keywords ADD click_type VARCHAR(255) DEFAULT NULL COLLATE utf8mb4_unicode_ci');
    }
}
