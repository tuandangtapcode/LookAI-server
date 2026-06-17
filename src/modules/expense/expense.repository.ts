import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { BaseRepository } from '../common/base.repository'
import { StatisticDTO } from '../common/dto/statistic.dto'
import { GetListExpenseDTO } from './dto/get-list-expense.dto'
import { ExpenseEntity } from './expense.entity'
import { IExpenseByType } from './expense.interface'

@Injectable()
export class ExpenseRepository extends BaseRepository<ExpenseEntity> {
  constructor(
    @InjectRepository(ExpenseEntity)
    private readonly expenseRepository: Repository<ExpenseEntity>
  ) {
    super(expenseRepository)
  }

  async getListExpense(options: GetListExpenseDTO) {
    const { forMonth, forYear, type, currentPage, pageSize } = options

    const qb = this.expenseRepository
      .createQueryBuilder('e')
      .select([
        'e.id as id',
        'e.amount as amount',
        'e.type as type',
        'e.description as description',
        'e.created_at as createdAt',
        'e.for_month as forMonth',
        'e.for_year as forYear'
      ])

    if (forMonth) {
      qb.andWhere('e.for_month = :forMonth', { forMonth })
    }
    if (type) {
      qb.andWhere('e.type = :type', { type })
    }
    if (forYear) {
      qb.andWhere('e.for_year = :forYear', { forYear })
    }

    const result = await this.getListWithPagination<ExpenseEntity>(qb, pageSize, currentPage)

    return result
  }

  async calculateExpense(options: StatisticDTO) {
    const { forMonth, forYear } = options

    const qb = this.expenseRepository
      .createQueryBuilder('e')
      .select(['e.type as type', 'SUM(e.amount) as totalAmount'])
      .groupBy('e.type')

    if (forMonth && forYear) {
      qb.where('e.for_month = :forMonth', { forMonth }).andWhere('e.for_year = :forYear', { forYear })
    }
    if (forYear) {
      qb.where('e.for_year = :forYear', { forYear })
    }

    const analysis = await qb.getRawMany<IExpenseByType>()
    const total = analysis.reduce((sum, item) => sum + Number(item.totalAmount), 0)

    return { total, analysis: analysis.map((item) => ({ ...item, totalAmount: Number(item.totalAmount) })) }
  }
}
