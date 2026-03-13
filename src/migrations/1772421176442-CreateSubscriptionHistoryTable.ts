import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateSubscriptionHistoryTable1772421176442 implements MigrationInterface {
  name = 'CreateSubscriptionHistoryTable1772421176442'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`subscription_history\` (\`id\` varchar(36) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`user_id\` varchar(255) NOT NULL, \`package_id\` varchar(255) NOT NULL, \`package_snapshot\` text NOT NULL, \`status\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    )
    await queryRunner.query(
      `ALTER TABLE \`subscription_history\` ADD CONSTRAINT \`FK_f54e1c2dcc806ddcaae98571c09\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE \`subscription_history\` ADD CONSTRAINT \`FK_82200149572c72a50599cbabd3b\` FOREIGN KEY (\`package_id\`) REFERENCES \`package\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`subscription_history\` DROP FOREIGN KEY \`FK_82200149572c72a50599cbabd3b\``)
    await queryRunner.query(`ALTER TABLE \`subscription_history\` DROP FOREIGN KEY \`FK_f54e1c2dcc806ddcaae98571c09\``)
    await queryRunner.query(`DROP TABLE \`subscription_history\``)
  }
}
