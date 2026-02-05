<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260205000001 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Create user and note tables';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('CREATE TABLE "user" (
            id SERIAL PRIMARY KEY,
            email VARCHAR(180) NOT NULL,
            roles JSON NOT NULL,
            password VARCHAR(255) NOT NULL,
            is_verified BOOLEAN NOT NULL DEFAULT FALSE,
            confirmation_token VARCHAR(255) DEFAULT NULL,
            created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL
        )');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_8D93D649E7927C74 ON "user" (email)');
        $this->addSql('COMMENT ON COLUMN "user".created_at IS \'(DC2Type:datetime_immutable)\'');

        $this->addSql('CREATE TABLE note (
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL,
            title VARCHAR(255) NOT NULL,
            content TEXT NOT NULL,
            category VARCHAR(50) NOT NULL,
            status VARCHAR(50) NOT NULL,
            created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
            updated_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
            CONSTRAINT FK_CFBDFA14A76ED395 FOREIGN KEY (user_id) REFERENCES "user" (id) ON DELETE CASCADE
        )');
        $this->addSql('CREATE INDEX IDX_CFBDFA14A76ED395 ON note (user_id)');
        $this->addSql('COMMENT ON COLUMN note.created_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('COMMENT ON COLUMN note.updated_at IS \'(DC2Type:datetime_immutable)\'');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('DROP TABLE note');
        $this->addSql('DROP TABLE "user"');
    }
}
