<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20190211192425 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE email_endpoints CHANGE created_at created_at DATETIME NOT NULL, CHANGE updated_at updated_at DATETIME NOT NULL, CHANGE `to` `to` VARCHAR(255) NOT NULL');
        $this->addSql('ALTER TABLE endpoints CHANGE created_at created_at DATETIME NOT NULL, CHANGE updated_at updated_at DATETIME NOT NULL, CHANGE name name VARCHAR(255) NOT NULL, CHANGE type type VARCHAR(255) NOT NULL, CHANGE active active TINYINT(1) NOT NULL');
        $this->addSql('ALTER TABLE field_maps CHANGE created_at created_at DATETIME NOT NULL, CHANGE updated_at updated_at DATETIME NOT NULL, CHANGE name name VARCHAR(255) NOT NULL, CHANGE internal_email internal_email TINYINT(1) NOT NULL');
        $this->addSql('ALTER TABLE http_endpoints DROP FOREIGN KEY fieldMaps_httpEndpoints');
        $this->addSql('ALTER TABLE http_endpoints CHANGE created_at created_at DATETIME NOT NULL, CHANGE updated_at updated_at DATETIME NOT NULL, CHANGE url url VARCHAR(255) NOT NULL, CHANGE strip_blanks strip_blanks TINYINT(1) NOT NULL');
        $this->addSql('ALTER TABLE http_endpoints ADD CONSTRAINT FK_BF17FA697981D366 FOREIGN KEY (field_map_id) REFERENCES field_maps (id)');
        $this->addSql('ALTER TABLE leads CHANGE created_at created_at DATETIME NOT NULL, CHANGE updated_at updated_at DATETIME NOT NULL, CHANGE channel channel VARCHAR(100) NOT NULL, CHANGE delivery_status delivery_status VARCHAR(100) NOT NULL');
        $this->addSql('ALTER TABLE response_records DROP FOREIGN KEY endpoints_responseRecords');
        $this->addSql('ALTER TABLE response_records DROP FOREIGN KEY leads_responseRecords');
        $this->addSql('ALTER TABLE response_records CHANGE lead_id lead_id INT UNSIGNED DEFAULT NULL, CHANGE endpoint_id endpoint_id INT UNSIGNED DEFAULT NULL, CHANGE created_at created_at DATETIME NOT NULL, CHANGE updated_at updated_at DATETIME NOT NULL');
        $this->addSql('ALTER TABLE response_records ADD CONSTRAINT FK_37271E3821AF7E36 FOREIGN KEY (endpoint_id) REFERENCES endpoints (id)');
        $this->addSql('ALTER TABLE response_records ADD CONSTRAINT FK_37271E3855458D FOREIGN KEY (lead_id) REFERENCES leads (id)');
        $this->addSql('ALTER TABLE route_endpoint_maps DROP FOREIGN KEY endpoints_routes');
        $this->addSql('ALTER TABLE route_endpoint_maps CHANGE endpoint_id endpoint_id INT UNSIGNED DEFAULT NULL, CHANGE created_at created_at DATETIME NOT NULL, CHANGE updated_at updated_at DATETIME NOT NULL');
        $this->addSql('ALTER TABLE route_endpoint_maps ADD CONSTRAINT FK_433BEFA221AF7E36 FOREIGN KEY (endpoint_id) REFERENCES endpoints (id)');
        $this->addSql('ALTER TABLE users CHANGE created_at created_at DATETIME NOT NULL, CHANGE updated_at updated_at DATETIME NOT NULL, CHANGE role role VARCHAR(255) NOT NULL');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE email_endpoints CHANGE created_at created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL, CHANGE updated_at updated_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL, CHANGE `to` `to` VARCHAR(255) DEFAULT \'\' NOT NULL COLLATE latin1_swedish_ci');
        $this->addSql('ALTER TABLE endpoints CHANGE created_at created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL, CHANGE updated_at updated_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL, CHANGE name name VARCHAR(255) DEFAULT \'\' NOT NULL COLLATE latin1_swedish_ci, CHANGE type type VARCHAR(255) DEFAULT \'\' NOT NULL COLLATE latin1_swedish_ci, CHANGE active active TINYINT(1) DEFAULT \'0\' NOT NULL');
        $this->addSql('ALTER TABLE field_maps CHANGE created_at created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL, CHANGE updated_at updated_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL, CHANGE name name VARCHAR(255) DEFAULT \'\' NOT NULL COLLATE latin1_swedish_ci, CHANGE internal_email internal_email TINYINT(1) DEFAULT \'0\' NOT NULL');
        $this->addSql('ALTER TABLE http_endpoints DROP FOREIGN KEY FK_BF17FA697981D366');
        $this->addSql('ALTER TABLE http_endpoints CHANGE created_at created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL, CHANGE updated_at updated_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL, CHANGE url url VARCHAR(255) DEFAULT \'\' NOT NULL COLLATE latin1_swedish_ci, CHANGE strip_blanks strip_blanks TINYINT(1) DEFAULT \'0\' NOT NULL');
        $this->addSql('ALTER TABLE http_endpoints ADD CONSTRAINT fieldMaps_httpEndpoints FOREIGN KEY (field_map_id) REFERENCES field_maps (id) ON UPDATE CASCADE');
        $this->addSql('ALTER TABLE leads CHANGE created_at created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL, CHANGE updated_at updated_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL, CHANGE channel channel VARCHAR(100) DEFAULT \'unknown\' NOT NULL COLLATE latin1_swedish_ci, CHANGE delivery_status delivery_status VARCHAR(100) DEFAULT \'unsent\' NOT NULL COLLATE latin1_swedish_ci');
        $this->addSql('ALTER TABLE response_records DROP FOREIGN KEY FK_37271E3821AF7E36');
        $this->addSql('ALTER TABLE response_records DROP FOREIGN KEY FK_37271E3855458D');
        $this->addSql('ALTER TABLE response_records CHANGE endpoint_id endpoint_id INT UNSIGNED NOT NULL, CHANGE lead_id lead_id INT UNSIGNED NOT NULL, CHANGE created_at created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL, CHANGE updated_at updated_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL');
        $this->addSql('ALTER TABLE response_records ADD CONSTRAINT endpoints_responseRecords FOREIGN KEY (endpoint_id) REFERENCES endpoints (id) ON UPDATE CASCADE');
        $this->addSql('ALTER TABLE response_records ADD CONSTRAINT leads_responseRecords FOREIGN KEY (lead_id) REFERENCES leads (id) ON UPDATE CASCADE');
        $this->addSql('ALTER TABLE route_endpoint_maps DROP FOREIGN KEY FK_433BEFA221AF7E36');
        $this->addSql('ALTER TABLE route_endpoint_maps CHANGE endpoint_id endpoint_id INT UNSIGNED NOT NULL, CHANGE created_at created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL, CHANGE updated_at updated_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL');
        $this->addSql('ALTER TABLE route_endpoint_maps ADD CONSTRAINT endpoints_routes FOREIGN KEY (endpoint_id) REFERENCES endpoints (id) ON UPDATE CASCADE ON DELETE CASCADE');
        $this->addSql('ALTER TABLE users CHANGE created_at created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL, CHANGE updated_at updated_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL, CHANGE role role VARCHAR(255) DEFAULT \'\' NOT NULL COLLATE latin1_swedish_ci');
    }
}
