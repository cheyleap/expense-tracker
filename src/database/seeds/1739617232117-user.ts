import { MigrationInterface, QueryRunner } from 'typeorm';
import * as bcrypt from 'bcryptjs';

export class User1739617232117 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const passwordSalt: number = Number(process.env.PASSWORD_SALT);
    const hashedPassword: string = bcrypt.hashSync(
      String(process.env.ADMIN_PASSWORD),
      passwordSalt,
    );

    await queryRunner.query(`
        INSERT INTO "user" (username, password, email)
        VALUES ('${process.env.ADMIN_USERNAME}', '${hashedPassword}', '${process.env.ADMIN_EMAIL}')
    `);
  }

  public async down(): Promise<void> {}
}
