import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { BaseRepository } from '../common/base.repository'
import { GetListFeedbackDTO } from './dto/get-list-feedback.dto'
import { FeedbackEntity } from './feedback.entity'
import { IFeedback } from './feedback.interface'

@Injectable()
export class FeedbackRepository extends BaseRepository<FeedbackEntity> {
  constructor(
    @InjectRepository(FeedbackEntity)
    private readonly feedbackRepository: Repository<FeedbackEntity>
  ) {
    super(feedbackRepository)
  }

  async getListFeedback(options: GetListFeedbackDTO, userId?: string) {
    const { pageSize, currentPage, type, status, textSearch } = options

    const qb = this.feedbackRepository
      .createQueryBuilder('f')
      .select([
        'f.id as id',
        'f.type as type',
        'f.content as content',
        'f.status as status',
        'f.created_at as createdAt',
        'f.updated_at as updatedAt'
      ])
      .addSelect(
        `
        JSON_OBJECT(
          'id', u.id,
          'userName', u.user_name
        ) as user
      `
      )
      .innerJoin('user', 'u', 'u.id = f.user_id')
      .where('f.deleted_at IS NULL')

    if (userId) {
      qb.andWhere('f.user_id = :userId', { userId })
    }
    if (type) {
      qb.andWhere('f.type = :type', { type })
    }
    if (status) {
      qb.andWhere('f.status = :status', { status })
    }
    if (textSearch) {
      qb.andWhere('u.user_name LIKE :textSearch', { textSearch: `%${textSearch}%` })
    }

    const result = await this.getListWithPagination<IFeedback>(qb, pageSize, currentPage)

    return result
  }
}
