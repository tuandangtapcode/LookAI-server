import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreatePaymentTable1772421263375 implements MigrationInterface {
  name = 'CreatePaymentTable1772421263375'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`payment\` (\`id\` varchar(36) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`user_id\` varchar(255) NOT NULL, \`package_id\` varchar(255) NOT NULL, \`subscription_history_id\` varchar(255) NOT NULL, \`amount\` int NOT NULL, \`order_code\` varchar(100) NOT NULL, UNIQUE INDEX \`REL_4529b42093fbe7315252b8ef00\` (\`subscription_history_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    )
    await queryRunner.query(
      `ALTER TABLE \`payment\` ADD CONSTRAINT \`FK_c66c60a17b56ec882fcd8ec770b\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE \`payment\` ADD CONSTRAINT \`FK_94b3ce14c6d01318825a78d715a\` FOREIGN KEY (\`package_id\`) REFERENCES \`package\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE \`payment\` ADD CONSTRAINT \`FK_4529b42093fbe7315252b8ef00b\` FOREIGN KEY (\`subscription_history_id\`) REFERENCES \`subscription_history\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`payment\` DROP FOREIGN KEY \`FK_4529b42093fbe7315252b8ef00b\``)
    await queryRunner.query(`ALTER TABLE \`payment\` DROP FOREIGN KEY \`FK_94b3ce14c6d01318825a78d715a\``)
    await queryRunner.query(`ALTER TABLE \`payment\` DROP FOREIGN KEY \`FK_c66c60a17b56ec882fcd8ec770b\``)
    await queryRunner.query(`DROP INDEX \`REL_4529b42093fbe7315252b8ef00\` ON \`payment\``)
    await queryRunner.query(`DROP TABLE \`payment\``)
  }
}
