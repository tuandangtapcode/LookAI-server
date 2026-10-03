import { Column, Entity } from 'typeorm'
import BaseModel from '../common/base.entity'
import { ItemCategoryEnum } from './item-type.enum'

@Entity({ name: 'item_type', schema: 'public' })
export class ItemTypeEntity extends BaseModel {
  @Column({ name: 'name', type: 'nvarchar', length: 255 })
  name: string

  @Column({ name: 'category', type: 'int' })
  category: ItemCategoryEnum
}
