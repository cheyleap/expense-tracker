import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitBudgetLimit1739611659376 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE budget_limit
        (
            id           SERIAL         NOT NULL,
            version      INTEGER        NOT NULL DEFAULT 0,
            limit_amount DECIMAL(10, 2) NOT NULL,
            user_id      INTEGER REFERENCES "user" (id) ON DELETE NO ACTION ON UPDATE NO ACTION,
            category_id  INTEGER REFERENCES "category" (id) ON DELETE NO ACTION ON UPDATE NO ACTION,
            updated_by   INTEGER REFERENCES "user" (id) ON DELETE NO ACTION ON UPDATE NO ACTION,
            created_by   INTEGER REFERENCES "user" (id) ON DELETE NO ACTION ON UPDATE NO ACTION,
            created_at   TIMESTAMP      NOT NULL DEFAULT now(),
            updated_at   TIMESTAMP,
            deleted_at   TIMESTAMP,
            CONSTRAINT "pk_budget_limit_id" PRIMARY KEY ("id")
        );
        CREATE UNIQUE INDEX inx_budget_limit_user_id_category_id ON budget_limit (user_id, category_id) WHERE deleted_at IS NULL;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE budget_limit');
  }
}
