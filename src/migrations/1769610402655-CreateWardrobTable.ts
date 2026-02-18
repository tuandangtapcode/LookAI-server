import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateWardrobTable1769610402655 implements MigrationInterface {
  name = 'CreateWardrobTable1769610402655'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`wardrobe\` (\`id\` varchar(36) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`name\` varchar(255) NOT NULL, \`user_id\` varchar(255) NOT NULL, \`item_type_id\` varchar(255) NULL, \`item_category\` int NOT NULL, \`image\` text NOT NULL, \`color\` varchar(255) NOT NULL, \`size\` varchar(255) NULL, \`is_favourite\` tinyint NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    )
    await queryRunner.query(
      `ALTER TABLE \`wardrobe\` ADD CONSTRAINT \`FK_5a3ee10559a855e3476731121b2\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE \`wardrobe\` ADD CONSTRAINT \`FK_ed25d4e71a0ba6eb7fc1c53feb8\` FOREIGN KEY (\`item_type_id\`) REFERENCES \`item_type\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`wardrobe\` DROP FOREIGN KEY \`FK_ed25d4e71a0ba6eb7fc1c53feb8\``)
    await queryRunner.query(`ALTER TABLE \`wardrobe\` DROP FOREIGN KEY \`FK_5a3ee10559a855e3476731121b2\``)
    await queryRunner.query(`DROP TABLE \`wardrobe\``)
  }
}
