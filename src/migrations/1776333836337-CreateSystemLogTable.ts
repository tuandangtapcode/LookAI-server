import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateSystemLogTable1776333836337 implements MigrationInterface {
  name = 'CreateSystemLogTable1776333836337'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`system_log\` (\`id\` varchar(36) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`type\` int NOT NULL, \`title\` text NOT NULL, \`message\` text NOT NULL, \`detail\` text NOT NULL, \`endpoint\` text NULL, \`body\` text NULL, \`third_endpoint\` text NULL, \`third_body\` text NULL, \`service\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`system_log\``)
  }
}
