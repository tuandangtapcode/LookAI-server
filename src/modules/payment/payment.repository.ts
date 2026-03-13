import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { BaseRepository } from '../common/base.repository'
import { StatisticDTO } from '../common/dto/statistic.dto'
import { PackageEntity } from '../package/package.entity'
import { SubscriptionHistoryEntity } from '../subscription-history/subscription-history.entity'
import { UserSubscriptionEntity } from '../user-subscription/user-subscription.entity'
import { CreatePaymentDTO } from './dto/create-payment.dto'
import { GetListPaymentDTO } from './dto/get-list-payment.dto'
import { PaymentEntity } from './payment.entity'

@Injectable()
export class PaymentRepository extends BaseRepository<PaymentEntity> {
  constructor(
    @InjectRepository(PaymentEntity)
    private readonly paymentRepository: Repository<PaymentEntity>
  ) {
    super(paymentRepository)
  }

  async createPayment(body: CreatePaymentDTO, userId: string, packageDetail: PackageEntity) {
    return this.paymentRepository.manager.transaction(async (manager) => {
      const paymentRepo = manager.getRepository(PaymentEntity)
      const userSubscriptionRepo = manager.getRepository(UserSubscriptionEntity)
      const subscriptionHistoryRepo = manager.getRepository(SubscriptionHistoryEntity)
      const { amount, packageId, subscriptionHistoryStatus, orderCode } = body
      const createSubscriptionHistory = subscriptionHistoryRepo.create({
        userId,
        packageId,
        packageSnapshot: JSON.stringify(packageDetail),
        status: subscriptionHistoryStatus
      })
      const createdSubscriptionHistory = await subscriptionHistoryRepo.save(createSubscriptionHistory)
      const createPayment = paymentRepo.create({
        userId,
        packageId,
        subscriptionHistoryId: createdSubscriptionHistory.id,
        amount,
        orderCode
      })
      await paymentRepo.save(createPayment)
      const startDate = new Date()
      const endDate = new Date()
      endDate.setDate(endDate.getDate() + packageDetail.duration)
      await userSubscriptionRepo.update(
        { userId },
        {
          packageId: packageDetail.id,
          quota: packageDetail.quota,
          usedQuota: 0,
          startDate,
          endDate
        }
      )
    })
  }

  async calculatePayment(options: StatisticDTO) {
    const { forMonth, forYear } = options
    const qb = this.paymentRepository.createQueryBuilder('p').select(['SUM(p.amount) as totalAmount']).groupBy('p.id')
    if (forMonth && forYear) {
      qb.where('Month(p.created_at) = :forMonth AND Year(p.created_at) = :forYear', { forMonth, forYear })
    }
    if (forYear) {
      qb.where('Year(p.created_at) = :forYear', { forYear })
    }
    const result = await qb.getRawOne<{ totalAmount: number }>()
    if (result && result.totalAmount) {
      return Number(result.totalAmount)
    }
    return 0
  }

  async getListPayment(options: GetListPaymentDTO, userId?: string) {
    const { currentPage, pageSize, packageName, orderCode, textSearch } = options
    const qb = this.paymentRepository
      .createQueryBuilder('p')
      .select(['p.id as id', 'p.amount as amount', 'p.order_code as orderCode', 'p.created_at as createdAt'])
      .addSelect(
        `
        JSON_OBJECT(
          'id', pk.id,
          'name', pk.name
        ) as package
      `
      )
      .addSelect(
        `
        JSON_OBJECT(
          'id', u.id,
          'userName', u.user_name
        ) as user
      `
      )
      .innerJoin('package', 'pk', 'pk.id = p.package_id')
      .innerJoin('user', 'u', 'u.id = p.user_id')
      .where('p.deleted_at IS NULL')
    if (userId) {
      qb.andWhere('p.user_id = :userId', { userId })
    }
    if (packageName) {
      qb.andWhere('pk.name LIKE :packageName', { packageName: `%${packageName}%` })
    }
    if (orderCode) {
      qb.andWhere('p.order_code LIKE :orderCode', { orderCode: `%${orderCode}%` })
    }
    if (textSearch) {
      qb.andWhere('u.user_name LIKE :textSearch', { textSearch: `%${textSearch}%` })
    }
    const result = await this.getListWithPagination<PaymentEntity>(qb, currentPage, pageSize)
    return result
  }
}
