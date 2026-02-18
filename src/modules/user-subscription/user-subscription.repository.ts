import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { BaseRepository } from '../common/base.repository'
import { UserSubscriptionEntity } from './user-subscription.entity'

@Injectable()
export class UserSubscriptionRepository extends BaseRepository<UserSubscriptionEntity> {
  constructor(
    @InjectRepository(UserSubscriptionEntity)
    private readonly userSubscriptionRepository: Repository<UserSubscriptionEntity>
  ) {
    super(userSubscriptionRepository)
  }

  async getSubscriptionByUser(userId: string) {
    const qb = this.userSubscriptionRepository
      .createQueryBuilder('us')
      .where('us.user_id = :userId', { userId })
      .leftJoinAndSelect('us.package', 'package')
    const result = await qb.getOne()
    return result
  }

  async getListSubscription() {
    const qb = this.userSubscriptionRepository.createQueryBuilder('us').leftJoinAndSelect('us.package', 'package')
    const result = await qb.getMany()
    return result
  }
}
