import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateUserTable1772421039182 implements MigrationInterface {
  name = 'CreateUserTable1772421039182'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`user\` (\`id\` varchar(36) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`email\` varchar(255) NOT NULL, \`sub\` varchar(100) NOT NULL, \`avatar\` text NULL, \`user_name\` varchar(255) NOT NULL, \`phone\` varchar(10) NULL, \`skin_color\` varchar(10) NULL, \`date_of_birth\` datetime NOT NULL, \`gender\` int NOT NULL, \`height\` int NULL, \`weight\` int NULL, \`bust\` int NULL, \`waist\` int NULL, \`hip\` int NULL, \`clothing_size\` varchar(255) NULL, \`current_style\` varchar(255)NULL, \`desired_style\` varchar(255) NULL, \`occupation\` varchar(255) NULL, \`place\` varchar(255) NULL, \`role\` int NOT NULL, \`status\` int NOT NULL DEFAULT '1', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`user\``)
  }
}
