import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateOutfitAdviceTable1771351474476 implements MigrationInterface {
  name = 'CreateOutfitAdviceTable1771351474476'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`outfit_advice\` (\`id\` varchar(36) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`user_id\` varchar(255) NOT NULL, \`package_id\` varchar(255) NOT NULL, \`request_payload\` json NOT NULL, \`response_payload\` json NOT NULL, \`input_token\` bigint NOT NULL, \`output_token\` bigint NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    )
    await queryRunner.query(
      `ALTER TABLE \`outfit_advice\` ADD CONSTRAINT \`FK_4c9699f2dd652e0f1a427341332\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE \`outfit_advice\` ADD CONSTRAINT \`FK_1ae43b4b9416f340b9a6715b731\` FOREIGN KEY (\`package_id\`) REFERENCES \`package\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`outfit_advice\` DROP FOREIGN KEY \`FK_1ae43b4b9416f340b9a6715b731\``)
    await queryRunner.query(`ALTER TABLE \`outfit_advice\` DROP FOREIGN KEY \`FK_4c9699f2dd652e0f1a427341332\``)
    await queryRunner.query(`DROP TABLE \`outfit_advice\``)
  }
}
