import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { BaseRepository } from '../common/base.repository'
import { StatisticDTO } from '../common/dto/statistic.dto'
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

    const result = await this.getListWithPagination<PaymentEntity>(qb, pageSize, currentPage)

    return result
  }
}
