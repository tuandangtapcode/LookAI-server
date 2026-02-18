import { BooleanEnum, ItemCategoryEnum } from 'src/utils/enum/common'
import { ItemTypeEntity } from '../item-type/item-type.entity'

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
