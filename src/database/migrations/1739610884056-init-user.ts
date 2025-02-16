import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitUser1739610884056 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE "user"
        (
            id         SERIAL      NOT NULL,
            version    INTEGER     NOT NULL DEFAULT 0,
            username   VARCHAR(50) NOT NULL,
            password   VARCHAR     NOT NULL,
            email      VARCHAR(50) NOT NULL,
            phone      VARCHAR(20),
            updated_by INTEGER,
            created_by INTEGER,
            created_at TIMESTAMP   NOT NULL DEFAULT now(),
            updated_at TIMESTAMP,
            deleted_at TIMESTAMP,
            CONSTRAINT "pk_user_id" PRIMARY KEY ("id")
        );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE user');
  }
}
