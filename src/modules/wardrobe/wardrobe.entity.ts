import { BooleanEnum, ItemCategoryEnum } from 'src/utils/enum/common'
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import BaseModel from '../common/base'
import { ItemTypeEntity } from '../item-type/item-type.entity'
import { UserEntity } from '../user/user.entity'

@Entity({ name: 'wardrobe', schema: 'public' })
export class WardrobeEntity extends BaseModel {
  @Column({ name: 'name', type: 'nvarchar', length: 255 })
  name: string

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string

  @Column({ name: 'item_type_id', type: 'uuid', nullable: true })
  itemTypeId: string

  @Column({ name: 'item_category', type: 'int' })
  itemCategory: ItemCategoryEnum

  @Column({ name: 'image', type: 'text' })
  image: string

  @Column({ name: 'color', type: 'varchar', length: 255 })
  color: string

  @Column({ name: 'size', type: 'varchar', nullable: true })
  size: string

  @Column({ name: 'is_favourite', type: 'tinyint' })
  isFavourite: BooleanEnum

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity

  @ManyToOne(() => ItemTypeEntity)
  @JoinColumn({ name: 'item_type_id' })
  itemType: ItemTypeEntity
}
