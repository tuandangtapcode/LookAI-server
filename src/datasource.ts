import { DataSource } from 'typeorm'
import { appDataSourceConfig } from './config/database'
import { UserEntity } from './modules/user/user.entity'

export const AppDataSource = new DataSource({
  ...appDataSourceConfig,
  entities: [UserEntity]
  // entities: [`src/modules/**/*.entity.{js,ts}`]
})
