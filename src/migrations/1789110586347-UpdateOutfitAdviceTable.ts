import { MigrationInterface, QueryRunner } from 'typeorm'

export class UpdateOutfitAdviceTable1789110586347 implements MigrationInterface {
  name = 'UpdateOutfitAdviceTable1789110586347'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`outfit_advice\` ADD \`rating\` int NULL`)
    await queryRunner.query(`ALTER TABLE \`outfit_advice\` ADD \`parent_advice_id\` varchar(255) NULL`)
    await queryRunner.query(
      `ALTER TABLE \`outfit_advice\` ADD CONSTRAINT \`FK_da76ba546263bb25bc40ea367e5\` FOREIGN KEY (\`parent_advice_id\`) REFERENCES \`outfit_advice\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`outfit_advice\` DROP FOREIGN KEY \`FK_da76ba546263bb25bc40ea367e5\``)
    await queryRunner.query(`ALTER TABLE \`outfit_advice\` DROP COLUMN \`parent_advice_id\``)
    await queryRunner.query(`ALTER TABLE \`outfit_advice\` DROP COLUMN \`rating\``)
  }
}
