import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { connectDataSourceConfig } from './config/database'
import { AuthModule } from './modules/auth/auth.module'
import { SystemkeyModule } from './modules/systemkey/systemkey.module'
import { UserModule } from './modules/user/user.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(connectDataSourceConfig),
    SystemkeyModule,
    AuthModule,
    UserModule
  ]
})
export class AppModule {}
