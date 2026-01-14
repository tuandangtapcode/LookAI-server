import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateSystemkeyTable1768317861992 implements MigrationInterface {
  name = 'CreateSystemkeyTable1768317861992'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`systemkey\` (\`id\` varchar(36) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`parent_id\` varchar(255) NULL, \`key_value\` int NOT NULL DEFAULT '0', \`key_name\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`systemkey\``)
  }
}
