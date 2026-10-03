import { BooleanEnum } from '../common/common.enum'
import { ItemTypeEntity } from '../item-type/item-type.entity'
import { ItemCategoryEnum } from '../item-type/item-type.enum'

export interface IWardrobe {
  name: string
  userId: string
  itemType: ItemTypeEntity
  itemCategory: ItemCategoryEnum
  image: string
  color: string
  size: string
  isFavourite: BooleanEnum
}

export interface IGetQuantityByItemCategory {
  itemCategory: ItemCategoryEnum
  itemTypeId: string
  quantity: number
}
