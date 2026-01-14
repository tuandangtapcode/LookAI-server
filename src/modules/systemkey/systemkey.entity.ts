import { Column, Entity } from 'typeorm'
import BaseModel from '../common/base'

@Entity({ name: 'systemkey', schema: 'public' })
export class SystemkeyEntity extends BaseModel {
  @Column({ name: 'parent_id', type: 'uuid', nullable: true })
  parentId: string

  @Column({ name: 'key_value', type: 'int', default: 0 })
  keyValue: number

  @Column({ name: 'key_name', type: 'nvarchar', length: 255 })
  keyName: string
}
