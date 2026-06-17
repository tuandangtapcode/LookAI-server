import { Injectable } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'
import moment from 'moment'
import { SubscriptionHistoryStatusEnum } from 'src/utils/enum/subscription-history'
import { UserSubscriptionStatusEnum } from 'src/utils/enum/user-subscription'
import { logCronJob, logError } from 'src/utils/helper/log'
import { SubscriptionHistoryEntity } from '../subscription-history/subscription-history.entity'
import { SubscriptionHistoryRepository } from '../subscription-history/subscription-history.repository'
import { UserSubscriptionEntity } from '../user-subscription/user-subscription.entity'
import { UserSubscriptionRepository } from '../user-subscription/user-subscription.repository'
import { LogRepository } from './../log/log.repository'

@Injectable()
export class CronJobService {
  constructor(
    private readonly userSubscriptionRepository: UserSubscriptionRepository,
    private readonly logRepository: LogRepository,
    private readonly subscriptionHistoryRepository: SubscriptionHistoryRepository
  ) {}

  @Cron('0 0 0 * * *')
  async updateUserSubscription() {
    try {
      const subscriptions = await this.userSubscriptionRepository.getListSubscription()
      if (!subscriptions.length) return

      const updateSubscriptionPromises: Promise<UserSubscriptionEntity>[] = []
      const subscriptionHistoryPromises: Promise<SubscriptionHistoryEntity>[] = []

      subscriptions.forEach((subscription) => {
        const { package: subscriptionPackage } = subscription

        if (subscriptionPackage.name === 'Free' && moment().isAfter(subscription.endDate)) {
          updateSubscriptionPromises.push(
            this.userSubscriptionRepository.updateOne(subscription, {
              usedQuota: 0,
              startDate: moment(subscription.startDate).add(1, 'months'),
              endDate: moment(subscription.endDate).add(1, 'months')
            })
          )
        }

        if (subscriptionPackage.price && moment().isAfter(subscription.endDate)) {
          updateSubscriptionPromises.push(
            this.userSubscriptionRepository.updateOne(subscription, {
              usedQuota: 0,
              status: UserSubscriptionStatusEnum.EXPIRED
            })
          )
          subscriptionHistoryPromises.push(
            this.subscriptionHistoryRepository.insertOne({
              userId: subscription.userId,
              packageId: subscription.packageId,
              packageSnapshot: JSON.stringify(subscriptionPackage),
              status: SubscriptionHistoryStatusEnum.EXPIRED
            })
          )
        }
      })

      await Promise.all(updateSubscriptionPromises)
      await Promise.all(subscriptionHistoryPromises)

      this.logRepository.insertOne(
        logCronJob('Cron Job-updateUserSubscription', 'Cron Job-updateUserSubscription success')
      )
    } catch (error: any) {
      this.logRepository.insertOne(logError({ method: 'Cron Job-updateUserSubscription', error }))
    }
  }
}
