import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateFeedbackTable1776333442455 implements MigrationInterface {
  name = 'CreateFeedbackTable1776333442455'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`feedback\` (\`id\` varchar(36) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`user_id\` varchar(255) NOT NULL, \`type\` int NOT NULL, \`content\` text NOT NULL, \`status\` int NOT NULL DEFAULT '1', UNIQUE INDEX \`REL_121c67d42dd543cca0809f5990\` (\`user_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    )
    await queryRunner.query(
      `ALTER TABLE \`feedback\` ADD CONSTRAINT \`FK_121c67d42dd543cca0809f59901\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`feedback\` DROP FOREIGN KEY \`FK_121c67d42dd543cca0809f59901\``)
    await queryRunner.query(`DROP INDEX \`REL_121c67d42dd543cca0809f5990\` ON \`feedback\``)
    await queryRunner.query(`DROP TABLE \`feedback\``)
  }
}
