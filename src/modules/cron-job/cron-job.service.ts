import { Injectable } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'
import moment from 'moment'
import { UserSubscriptionStatusEnum } from 'src/utils/enum/user-subscription'
import { UserSubscriptionEntity } from '../user-subscription/user-subscription.entity'
import { UserSubscriptionRepository } from '../user-subscription/user-subscription.repository'

@Injectable()
export class CronJobService {
  constructor(private readonly userSubscriptionRepository: UserSubscriptionRepository) {}

  @Cron('0 0 0 * * *')
  async updateUserSubscription() {
    try {
      const subscriptions = await this.userSubscriptionRepository.getListSubscription()
      if (!subscriptions.length) return
      const updateSubscriptionPromises: Promise<UserSubscriptionEntity>[] = []
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
        if (['Premium', 'Basic'].includes(subscriptionPackage.name) && moment().isAfter(subscription.endDate)) {
          updateSubscriptionPromises.push(
            this.userSubscriptionRepository.updateOne(subscription, {
              usedQuota: 0,
              status: UserSubscriptionStatusEnum.EXPIRED
            })
          )
        }
      })
      await Promise.all(updateSubscriptionPromises)
      console.log('CRON JOB-updateUserSubscription success')
    } catch (error) {
      console.log('CRON JOB-updateUserSubscription error: ', error)
    }
  }
}
