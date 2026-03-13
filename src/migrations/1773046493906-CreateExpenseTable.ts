import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateExpenseTable1773046493906 implements MigrationInterface {
  name = 'CreateExpenseTable1773046493906'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`expense\` (\`id\` varchar(36) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`amount\` int NOT NULL, \`type\` varchar(50) NOT NULL, \`description\` text NULL, \`for_month\` int NOT NULL, \`for_year\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`expense\``)
  }
}
