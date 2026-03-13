import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { BaseRepository } from '../common/base.repository'
import { GetListWardrobeDTO } from './dto/get-list-wardrobe.dto'
import { WardrobeEntity } from './wardrobe.entity'

@Injectable()
export class WardrobeRepository extends BaseRepository<WardrobeEntity> {
  constructor(
    @InjectRepository(WardrobeEntity)
    private readonly wardrobeRepository: Repository<WardrobeEntity>
  ) {
    super(wardrobeRepository)
  }

  async getListWardrobe(options: GetListWardrobeDTO, userId: string) {
    const { itemCategory, itemTypeId, color, size, isFavourite } = options
    const qb = this.wardrobeRepository
      .createQueryBuilder('w')
      .leftJoinAndSelect('w.itemType', 'itemType')
      .where('w.user_id = :userId', { userId })
    if (itemCategory) {
      qb.andWhere('w.item_category = :itemCategory', { itemCategory })
    }
    if (itemTypeId) {
      qb.andWhere('w.item_type_id = :itemTypeId', { itemTypeId })
    }
    if (color) {
      qb.andWhere('w.color = :color', { color })
    }
    if (size) {
      qb.andWhere('w.size LIKE :size', { size: `%${size}%` })
    }
    if (isFavourite) {
      qb.andWhere('w.is_favourite = :isFavourite', { isFavourite })
    }
    const result = await qb.getMany()
    return result
  }
}
