import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { BaseRepository } from '../common/base.repository'
import { ItemTypeEntity } from './item-type.entity'

@Injectable()
export class ItemTypeRepository extends BaseRepository<ItemTypeEntity> {
  constructor(
    @InjectRepository(ItemTypeEntity)
    private readonly itemTypeRepository: Repository<ItemTypeEntity>
  ) {
    super(itemTypeRepository)
  }
}
