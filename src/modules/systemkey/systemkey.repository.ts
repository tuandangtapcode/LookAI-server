import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { BaseRepository } from '../common/base.repository'
import { CreateSystemkeyDTO } from './dto/create-systemkey.dto'
import { SystemkeyEntity } from './systemkey.entity'
import { IMaxChildKey } from './systemkey.interface'

@Injectable()
export class SystemkeyRepository extends BaseRepository<SystemkeyEntity> {
  constructor(
    @InjectRepository(SystemkeyEntity)
    private readonly systemkeyRepository: Repository<SystemkeyEntity>
  ) {
    super(systemkeyRepository)
  }

  async createSystemkey(data: CreateSystemkeyDTO) {
    await this.systemkeyRepository.manager.transaction(async (entityManager) => {
      const { keyName, subKeys } = data
      const systemkeyRepo = entityManager.getRepository(SystemkeyEntity)
      const createParentKey = systemkeyRepo.create({ keyName })
      const createdParentKey = await systemkeyRepo.save(createParentKey)
      const dataSubKey = subKeys.map((i) => ({
        ...i,
        parentId: createdParentKey.id
      }))
      this.insertMany(dataSubKey)
    })
  }

  async getMaxChildkey(parentId: string) {
    const queryBuilder = this.systemkeyRepository
      .createQueryBuilder('s')
      .select(['MAX(s.key_value) "max"', 's.parent_id "parentId"'])
      .where('s.parent_id = :parentId', { parentId })
    const systemkey = await queryBuilder.getRawOne<IMaxChildKey>()
    return systemkey
  }
}
