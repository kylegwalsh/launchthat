<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20190403155427 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE users ADD googleid VARCHAR(180) NOT NULL, ADD roles JSON NOT NULL, DROP google_id, DROP role');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_1483A5E9D14E68CA ON users (googleid)');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('DROP INDEX UNIQ_1483A5E9D14E68CA ON users');
        $this->addSql('ALTER TABLE users ADD google_id VARCHAR(255) DEFAULT NULL COLLATE utf8mb4_unicode_ci, ADD role VARCHAR(255) DEFAULT NULL COLLATE utf8mb4_unicode_ci, DROP googleid, DROP roles');
    }
}
