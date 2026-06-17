import { Module } from '@nestjs/common'
import { SubscriptionHistoryModule } from '../subscription-history/subscription-history.module'
import { UserSubscriptionModule } from '../user-subscription/user-subscription.module'
import { CronJobService } from './cron-job.service'

@Module({
  imports: [UserSubscriptionModule, SubscriptionHistoryModule],
  providers: [CronJobService]
})
export class CronJobModule {}
