import { Module } from '@nestjs/common'
import { UserSubscriptionModule } from '../user-subscription/user-subscription.module'
import { CronJobService } from './cron-job.service'

@Module({
  imports: [UserSubscriptionModule],
  providers: [CronJobService]
})
export class CronJobModule {}
