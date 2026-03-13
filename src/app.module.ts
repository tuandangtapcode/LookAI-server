import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ScheduleModule } from '@nestjs/schedule'
import { TypeOrmModule } from '@nestjs/typeorm'
import { connectDataSourceConfig } from './config/database'
import { AuthModule } from './modules/auth/auth.module'
import { CronJobModule } from './modules/cron-job/cron-job.module'
import { DashboardModule } from './modules/dashboard/dashboard.module'
import { ExpenseModule } from './modules/expense/expense.module'
import { FileModule } from './modules/file/file.module'
import { ItemTypeModule } from './modules/item-type/item-type.module'
import { OutfitAdviceModule } from './modules/outfit-advice/outfit-advice.module'
import { PackageModule } from './modules/package/package.module'
import { PaymentModule } from './modules/payment/payment.module'
import { SubscriptionHistoryModule } from './modules/subscription-history/subscription-history.module'
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
    CronJobModule,
    SubscriptionHistoryModule,
    PaymentModule,
    ExpenseModule,
    DashboardModule
  ]
})
export class AppModule {}
