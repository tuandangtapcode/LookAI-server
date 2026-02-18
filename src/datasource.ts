import { DataSource } from 'typeorm'
import { appDataSourceConfig } from './config/database'

export const AppDataSource = new DataSource({
  ...appDataSourceConfig,
  entities: [`src/modules/**/*.entity.{js,ts}`]
})
