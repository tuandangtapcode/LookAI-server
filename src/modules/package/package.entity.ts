import { BooleanEnum } from 'src/utils/enum/common'
import { Column, Entity } from 'typeorm'
import BaseModel from '../common/base'

@Entity({ name: 'package', schema: 'public' })
export class PackageEntity extends BaseModel {
  @Column({ name: 'name', type: 'nvarchar', length: 255 })
  name: string

  @Column({ name: 'duration', type: 'int', nullable: true })
  duration?: number

  @Column({ name: 'price', type: 'int' })
  price: number

  @Column({ name: 'quota', type: 'int' })
  quota: number

  @Column({ name: 'description', type: 'text' })
  description: string

  @Column({ name: 'is_active', type: 'tinyint', default: BooleanEnum.TRUE })
  isActive: BooleanEnum
}
