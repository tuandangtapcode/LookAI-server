import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ScheduleModule } from '@nestjs/schedule'
import { TypeOrmModule } from '@nestjs/typeorm'
import { connectDataSourceConfig } from './config/database'
import { AuthModule } from './modules/auth/auth.module'
import { CronJobModule } from './modules/cron-job/cron-job.module'
import { FileModule } from './modules/file/file.module'
import { ItemTypeModule } from './modules/item-type/item-type.module'
import { OutfitAdviceModule } from './modules/outfit-advice/outfit-advice.module'
import { PackageModule } from './modules/package/package.module'
import { SystemkeyModule } from './modules/systemkey/systemkey.module'
import { UserSubscriptionModule } from './modules/user-subscription/user-subscription.module'
import { UserModule } from './modules/user/user.module'
import { WardrobeModule } from './modules/wardrobe/wardrobe.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(connectDataSourceConfig),
    ScheduleModule.forRoot(),
    SystemkeyModule,
    AuthModule,
    UserModule,
    ItemTypeModule,
    FileModule,
    WardrobeModule,
    PackageModule,
    UserSubscriptionModule,
    OutfitAdviceModule,
    CronJobModule
  ]
})
export class AppModule {}
