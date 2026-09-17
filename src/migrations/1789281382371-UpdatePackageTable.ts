import { MigrationInterface, QueryRunner } from 'typeorm'

export class UpdatePackageTable1789281382371 implements MigrationInterface {
  name = 'UpdatePackageTable1789281382371'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`user_subscription\` DROP FOREIGN KEY \`FK_user_subscription_package\``)
    await queryRunner.query(`ALTER TABLE \`package\` ADD \`refine\` int NOT NULL`)
    await queryRunner.query(
      `ALTER TABLE \`user_subscription\` ADD CONSTRAINT \`FK_ccf46e0d8db7ab1e79f07c05271\` FOREIGN KEY (\`package_id\`) REFERENCES \`package\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`user_subscription\` DROP FOREIGN KEY \`FK_ccf46e0d8db7ab1e79f07c05271\``)
    await queryRunner.query(`ALTER TABLE \`package\` DROP COLUMN \`refine\``)
    await queryRunner.query(
      `ALTER TABLE \`user_subscription\` ADD CONSTRAINT \`FK_user_subscription_package\` FOREIGN KEY (\`package_id\`) REFERENCES \`package\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }
}
