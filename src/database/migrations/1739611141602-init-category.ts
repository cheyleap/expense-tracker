import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitCategory1739611141602 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE category
        (
            id          SERIAL      NOT NULL,
            version     INTEGER     NOT NULL DEFAULT 0,
            name        VARCHAR(20) NOT NULL,
            description TEXT,
            updated_by  INTEGER REFERENCES "user" (id) ON DELETE NO ACTION ON UPDATE NO ACTION,
            created_by  INTEGER REFERENCES "user" (id) ON DELETE NO ACTION ON UPDATE NO ACTION,
            created_at  TIMESTAMP   NOT NULL DEFAULT now(),
            updated_at  TIMESTAMP,
            deleted_at  TIMESTAMP,
            CONSTRAINT "pk_category_id" PRIMARY KEY ("id")
        );
        CREATE UNIQUE INDEX inx_category_name ON category (name) WHERE deleted_at IS NULL;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE category');
  }
}
