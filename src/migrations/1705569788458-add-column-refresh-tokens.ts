import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddColumnRefreshTokens1705569788458 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD "refresh_tokens" text array NOT NULL DEFAULT '{}'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "refresh_tokens"`);
  }
}
