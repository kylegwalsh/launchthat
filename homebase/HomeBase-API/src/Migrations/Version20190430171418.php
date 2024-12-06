<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20190430171418 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE fields ADD short_name VARCHAR(255)');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_7EE5E3885E237E06 ON fields (name)');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_7EE5E3883EE4B093 ON fields (short_name)');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('DROP INDEX UNIQ_7EE5E3885E237E06 ON fields');
        $this->addSql('DROP INDEX UNIQ_7EE5E3883EE4B093 ON fields');
        $this->addSql('ALTER TABLE fields DROP short_name');
    }
}
