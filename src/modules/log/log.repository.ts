import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DeepPartial, Repository } from 'typeorm'
import { BaseRepository } from '../common/base.repository'
import { GetListLogDTO } from './dto/get-list-log.dto'
import { LogEntity } from './log.entity'

@Injectable()
export class LogRepository extends BaseRepository<LogEntity> {
  private readonly logger = new Logger(LogRepository.name)

  constructor(
    @InjectRepository(LogEntity)
    private readonly logRepository: Repository<LogEntity>
  ) {
    super(logRepository)
  }

  async insertLogSafe(data: DeepPartial<LogEntity>) {
    return this.insertOne(data).catch((err: any) => {
      this.logger.error(`Failed to persist log to database: ${err?.message}`, err?.stack)
    })
  }

  async getListLog(options: GetListLogDTO) {
    const { pageSize, currentPage, type, service } = options

    const qb = this.logRepository
      .createQueryBuilder('sl')
      .select([
        'sl.id as id',
        'sl.type as type',
        'sl.title as title',
        'sl.message as message',
        'sl.detail as detail',
        'sl.endpoint as endpoint',
        'sl.body as body',
        'sl.third_endpoint as thirdEndpoint',
        'sl.third_body as thirdBody',
        'sl.service as service',
        'sl.created_at as createdAt'
      ])
      .where('sl.deleted_at IS NULL')

    if (type) {
      qb.andWhere('sl.type = :type', { type })
    }
    if (service) {
      qb.andWhere('sl.service = :service', { service })
    }

    const result = await this.getListWithPagination<LogEntity>(qb, pageSize, currentPage)

    return result
  }
}
