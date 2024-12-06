<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20190516160250 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE campaign_attribution DROP FOREIGN KEY FK_1F9BD1B3F639F774');
        $this->addSql('ALTER TABLE campaign_attribution ADD CONSTRAINT FK_1F9BD1B3F639F774 FOREIGN KEY (campaign_id) REFERENCES campaigns (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE route_fields DROP FOREIGN KEY FK_4F16125534ECB4E6');
        $this->addSql('ALTER TABLE route_fields ADD CONSTRAINT FK_4F16125534ECB4E6 FOREIGN KEY (route_id) REFERENCES routes (id) ON DELETE CASCADE');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE campaign_attribution DROP FOREIGN KEY FK_1F9BD1B3F639F774');
        $this->addSql('ALTER TABLE campaign_attribution ADD CONSTRAINT FK_1F9BD1B3F639F774 FOREIGN KEY (campaign_id) REFERENCES campaigns (id)');
        $this->addSql('ALTER TABLE route_fields DROP FOREIGN KEY FK_4F16125534ECB4E6');
        $this->addSql('ALTER TABLE route_fields ADD CONSTRAINT FK_4F16125534ECB4E6 FOREIGN KEY (route_id) REFERENCES routes (id)');
    }
}
