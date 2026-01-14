import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateUserTable1768324676037 implements MigrationInterface {
  name = 'CreateUserTable1768324676037'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`user\` (\`id\` varchar(36) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`email\` varchar(255) NOT NULL, \`avatar\` text NULL, \`user_name\` varchar(255) NOT NULL, \`phone\` varchar(255) NULL, \`date_of_birth\` datetime NOT NULL, \`gender\` int NOT NULL, \`role\` int NOT NULL, \`status\` int NOT NULL DEFAULT '1', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`user\``)
  }
}
