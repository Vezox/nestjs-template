import { MigrationInterface, QueryRunner } from 'typeorm';

export class Hehe1704774127545 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            alter table "user" add column "hehe" varchar(255) not null default 'hehe';
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            alter table "user" drop column "hehe";
        `);
  }
}
