import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_FILTER } from '@nestjs/core'
import { ScheduleModule } from '@nestjs/schedule'
import { TypeOrmModule } from '@nestjs/typeorm'
import { HttpExceptionFilter } from './common/filters/http-exceptions.filter'
import { connectDataSourceConfig } from './config/database'
import { RequestContextMiddleware } from './middlewares/request-context.middleware'
import { AuthModule } from './modules/auth/auth.module'
import { CronJobModule } from './modules/cron-job/cron-job.module'
import { DashboardModule } from './modules/dashboard/dashboard.module'
import { ExpenseModule } from './modules/expense/expense.module'
import { FeedbackModule } from './modules/feedback/feedback.module'
import { FileModule } from './modules/file/file.module'
import { ItemTypeModule } from './modules/item-type/item-type.module'
import { LogModule } from './modules/log/log.module'
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
    DashboardModule,
    FeedbackModule,
    LogModule
  ],
  providers: [{ provide: APP_FILTER, useClass: HttpExceptionFilter }]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestContextMiddleware).forRoutes('*')
  }
}
