import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitTransaction1739611280677 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE transaction
        (
            id          SERIAL         NOT NULL,
            version     INTEGER        NOT NULL DEFAULT 0,
            user_id     INTEGER        NOT NULL REFERENCES "user" (id) ON DELETE NO ACTION ON UPDATE NO ACTION,
            category_id INTEGER REFERENCES category (id) ON DELETE NO ACTION ON UPDATE NO ACTION,
            type        VARCHAR(50) CHECK (type IN ('Income', 'Expense')),
            amount      DECIMAL(10, 2) NOT NULL,
            date        TIMESTAMP               DEFAULT NOW(),
            description TEXT,
            updated_by  INTEGER REFERENCES "user" (id) ON DELETE NO ACTION ON UPDATE NO ACTION,
            created_by  INTEGER REFERENCES "user" (id) ON DELETE NO ACTION ON UPDATE NO ACTION,
            created_at  TIMESTAMP      NOT NULL DEFAULT now(),
            updated_at  TIMESTAMP,
            deleted_at  TIMESTAMP,
            CONSTRAINT "pk_transaction_id" PRIMARY KEY ("id")
        );

        CREATE UNIQUE INDEX inx_transaction_user_id_category_id ON transaction (user_id, category_id) WHERE deleted_at IS NULL;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE transaction');
  }
}
