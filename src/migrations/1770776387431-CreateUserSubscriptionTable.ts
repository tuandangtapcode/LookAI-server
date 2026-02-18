import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateUserSubscriptionTable1770776387431 implements MigrationInterface {
  name = 'CreateUserSubscriptionTable1770776387431'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`user_subscription\` (\`id\` varchar(36) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`user_id\` varchar(255) NOT NULL, \`package_id\` varchar(255) NOT NULL, \`start_date\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, \`end_date\` datetime NOT NULL, \`quota\` int NOT NULL, \`used_quota\` int NOT NULL DEFAULT '0', \`status\` int NOT NULL DEFAULT '1', UNIQUE INDEX \`REL_3c6b79d14e6539ddb486aab80f\` (\`user_id\`), UNIQUE INDEX \`REL_ccf46e0d8db7ab1e79f07c0527\` (\`package_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    )
    await queryRunner.query(
      `ALTER TABLE \`user_subscription\` ADD CONSTRAINT \`FK_3c6b79d14e6539ddb486aab80f5\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE \`user_subscription\` ADD CONSTRAINT \`FK_ccf46e0d8db7ab1e79f07c05271\` FOREIGN KEY (\`package_id\`) REFERENCES \`package\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`user_subscription\` DROP FOREIGN KEY \`FK_ccf46e0d8db7ab1e79f07c05271\``)
    await queryRunner.query(`ALTER TABLE \`user_subscription\` DROP FOREIGN KEY \`FK_3c6b79d14e6539ddb486aab80f5\``)
    await queryRunner.query(`DROP INDEX \`REL_ccf46e0d8db7ab1e79f07c0527\` ON \`user_subscription\``)
    await queryRunner.query(`DROP INDEX \`REL_3c6b79d14e6539ddb486aab80f\` ON \`user_subscription\``)
    await queryRunner.query(`DROP TABLE \`user_subscription\``)
  }
}
