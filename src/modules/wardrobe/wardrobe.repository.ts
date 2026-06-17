import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { BaseRepository } from '../common/base.repository'
import { GetListWardrobeDTO } from './dto/get-list-wardrobe.dto'
import { GetQuantityWardrobeDTO } from './dto/get-quantity-wardrobe.dto'
import { WardrobeEntity } from './wardrobe.entity'
import { IGetQuantityByItemCategory, IWardrobe } from './wardrobe.interface'

@Injectable()
export class WardrobeRepository extends BaseRepository<WardrobeEntity> {
  constructor(
    @InjectRepository(WardrobeEntity)
    private readonly wardrobeRepository: Repository<WardrobeEntity>
  ) {
    super(wardrobeRepository)
  }

  async getListWardrobe(options: GetListWardrobeDTO, userId: string) {
    const { itemCategory, itemTypeId, color, size, isFavourite, currentPage, pageSize } = options

    const qb = this.wardrobeRepository
      .createQueryBuilder('w')
      .select([
        'w.id as id',
        'w.name as name',
        'w.image as image',
        'w.item_category as itemCategory',
        'w.color as color',
        'w.size as size',
        'w.is_favourite as isFavourite'
      ])
      .addSelect(
        `
          JSON_OBJECT(
            'id', it.id,
            'name', it.name
          ) as itemType
        `
      )
      .leftJoin('item_type', 'it', 'it.id = w.item_type_id')
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

    const result = await this.getListWithPagination<IWardrobe>(qb, pageSize, currentPage)

    return result
  }

  async getQuantity(options: GetQuantityWardrobeDTO, userId: string) {
    const { field } = options

    const qb = this.wardrobeRepository.createQueryBuilder('w').where('w.user_id = :userId', { userId })

    if (field === 'item_category') {
      qb.select(['w.item_category as itemCategory', 'COUNT(*) as quantity']).groupBy('w.item_category')
    } else if (field === 'item_type') {
      qb.select(['w.item_type_id as itemTypeId', 'COUNT(*) as quantity']).groupBy('w.item_type_id')
    }

    const result = await qb.getRawMany<IGetQuantityByItemCategory>()

    return result
  }
}
