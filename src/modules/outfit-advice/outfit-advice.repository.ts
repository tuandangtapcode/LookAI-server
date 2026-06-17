import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { BaseRepository } from '../common/base.repository'
import { PaginationDTO } from '../common/dto/pagination.dto'
import { StatisticDTO } from '../common/dto/statistic.dto'
import { OutfitAdviceEntity } from './outfit-advice.entity'
import { ICalculateTokenUsed, IGetTopTokenUsed } from './outfit-advice.interface'

@Injectable()
export class OutfitAdviceRepository extends BaseRepository<OutfitAdviceEntity> {
  constructor(
    @InjectRepository(OutfitAdviceEntity)
    private readonly outfitAdviceRepository: Repository<OutfitAdviceEntity>
  ) {
    super(outfitAdviceRepository)
  }

  async getListOutfitAdvice(options: PaginationDTO, userId: string, pagination: boolean = true) {
    const { pageSize, currentPage } = options

    const qb = this.outfitAdviceRepository
      .createQueryBuilder('oa')
      .where('oa.user_id = :userId', { userId })
      .orderBy('oa.created_at', 'DESC')

    if (pagination) {
      qb.select([
        'oa.id as id',
        'oa.request_payload as requestPayload',
        'oa.response_payload as responsePayload',
        'oa.input_token as inputToken',
        'oa.output_token as outputToken',
        'p.name as packageName',
        'oa.created_at as createdAt'
      ]).innerJoin('package', 'p', 'p.id = oa.package_id')

      const result = await this.getListWithPagination<OutfitAdviceEntity>(qb, pageSize, currentPage)

      return result
    }

    qb.limit(pageSize).skip((currentPage - 1) * pageSize)
    const result = await qb.getMany()

    return result
  }

  async calculateTokenUsed() {
    const qb = this.outfitAdviceRepository
      .createQueryBuilder('oa')
      .select(['SUM(oa.input_token) as totalInputToken', 'SUM(oa.output_token) as totalOutputToken'])
      .groupBy('oa.user_id')

    const result = await qb.getRawOne<ICalculateTokenUsed>()

    if (result) {
      return result
    }

    return { totalInputToken: 0, totalOutputToken: 0 }
  }

  async getTopTokenUsed(options: StatisticDTO) {
    const { forMonth, forYear } = options

    const qb = this.outfitAdviceRepository
      .createQueryBuilder('oa')
      .select([
        'u.id as userId',
        'u.name as userName',
        'SUM(oa.input_token) as totalInputToken',
        'SUM(oa.output_token) as totalOutputToken'
      ])
      .innerJoin('user', 'u', 'u.id = oa.user_id')
      .orderBy('totalInputToken', 'DESC')
      .groupBy('oa.user_id')
      .limit(5)

    if (forMonth && forYear) {
      qb.where('MONTH(oa.created_at) = :forMonth', { forMonth }).andWhere('YEAR(oa.created_at) = :forYear', { forYear })
    }

    const result = await qb.getRawMany<IGetTopTokenUsed>()

    return result
  }
}
