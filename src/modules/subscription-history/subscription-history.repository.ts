import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { BaseRepository } from '../common/base.repository'
import { GetUserSubscriptionHistoryDTO } from '../user-subscription/dto/get-user-subscription-history.dto'
import { IUserSubscriptionHistory } from '../user-subscription/user-subscription.interface'
import { SubscriptionHistoryEntity } from './subscription-history.entity'

@Injectable()
export class SubscriptionHistoryRepository extends BaseRepository<SubscriptionHistoryEntity> {
  constructor(
    @InjectRepository(SubscriptionHistoryEntity)
    private readonly subscriptionHistoryRepository: Repository<SubscriptionHistoryEntity>
  ) {
    super(subscriptionHistoryRepository)
  }

  async getUserSubscriptionHistory(options: GetUserSubscriptionHistoryDTO) {
    const { currentPage, pageSize, userId } = options

    const qb = this.subscriptionHistoryRepository
      .createQueryBuilder('sh')
      .select(['sh.id as id', 'sh.status as status', 'sh.created_at as createdAt'])
      .addSelect(
        `
        JSON_OBJECT(
          'id', pk.id,
          'name', pk.name
        ) as package
      `
      )
      .innerJoin('package', 'pk', 'pk.id = sh.package_id')
      .where('sh.user_id = :userId', { userId })

    const result = await this.getListWithPagination<IUserSubscriptionHistory>(qb, pageSize, currentPage)

    return result
  }
}
