import { AccountStatusEnum, GenderEnum, UserRoleEnum } from 'src/utils/enum/user'
import { Column, Entity } from 'typeorm'
import BaseModel from '../common/base'

@Entity({ name: 'user', schema: 'public' })
export class UserEntity extends BaseModel {
  @Column({ name: 'email', type: 'nvarchar', length: 255 })
  email: string

  @Column({ name: 'sub', type: 'nvarchar', length: 100 })
  sub: string

  @Column({ name: 'avatar', type: 'text', nullable: true })
  avatar?: string

  @Column({ name: 'user_name', type: 'nvarchar', length: 255 })
  userName: string

  @Column({ name: 'phone', type: 'varchar', length: 10, nullable: true })
  phone?: string

  @Column({ name: 'skin_color', type: 'varchar', length: 10, nullable: true })
  skinColor?: string

  @Column({ name: 'date_of_birth', type: 'datetime' })
  dateOfBirth: Date

  @Column({ name: 'gender', type: 'int' })
  gender: GenderEnum

  @Column({ name: 'height', type: 'int', nullable: true })
  height?: number

  @Column({ name: 'weight', type: 'int', nullable: true })
  weight?: number

  @Column({ name: 'bust', type: 'int', nullable: true })
  bust?: number

  @Column({ name: 'waist', type: 'int', nullable: true })
  waist?: number

  @Column({ name: 'hip', type: 'int', nullable: true })
  hip?: number

  @Column({ name: 'clothing_size', type: 'varchar', nullable: true })
  clothingSize?: string

  @Column({ name: 'current_style', type: 'nvarchar', length: 255, nullable: true })
  currentStyle?: string

  @Column({ name: 'desired_style', type: 'nvarchar', length: 255, nullable: true })
  desiredStyle?: string

  @Column({ name: 'occupation', type: 'nvarchar', length: 255, nullable: true })
  occupation?: string

  @Column({ name: 'place', type: 'nvarchar', length: 255, nullable: true })
  place?: string

  @Column({ name: 'role', type: 'int' })
  role: UserRoleEnum

  @Column({ name: 'status', type: 'int', default: AccountStatusEnum.NORMAL })
  status: AccountStatusEnum
}
