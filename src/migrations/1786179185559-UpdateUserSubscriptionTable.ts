import { MigrationInterface, QueryRunner } from 'typeorm'

export class UpdateUserSubscriptionTable1786179185559 implements MigrationInterface {
  name = 'UpdateUserSubscriptionTable1786179185559'

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Drop FK constraint trước
    await queryRunner.query(`ALTER TABLE \`user_subscription\` DROP FOREIGN KEY \`FK_ccf46e0d8db7ab1e79f07c05271\``)

    // 2. Drop unique index (đang là REL_...)
    await queryRunner.query(`DROP INDEX \`REL_ccf46e0d8db7ab1e79f07c0527\` ON \`user_subscription\``)

    // 3. Tạo lại FK constraint mới (không kèm unique, chỉ là index thường cho ManyToOne)
    await queryRunner.query(
      `ALTER TABLE \`user_subscription\`
       ADD CONSTRAINT \`FK_user_subscription_package\`
       FOREIGN KEY (\`package_id\`) REFERENCES \`package\`(\`id\`)
       ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`user_subscription\` DROP FOREIGN KEY \`FK_user_subscription_package\``)

    await queryRunner.query(
      `ALTER TABLE \`user_subscription\`
       ADD CONSTRAINT \`FK_ccf46e0d8db7ab1e79f07c05271\`
       FOREIGN KEY (\`package_id\`) REFERENCES \`package\`(\`id\`)
       ON DELETE NO ACTION ON UPDATE NO ACTION`
    )

    await queryRunner.query(
      `ALTER TABLE \`user_subscription\` ADD UNIQUE INDEX \`REL_ccf46e0d8db7ab1e79f07c0527\` (\`package_id\`)`
    )
  }
}
