import { AccountStatusEnum, GenderEnum, UserRoleEnum } from 'src/utils/enum/user'
import { Column, Entity } from 'typeorm'
import BaseModel from '../common/base'

@Entity({ name: 'user', schema: 'public' })
export class UserEntity extends BaseModel {
  @Column({ name: 'email', type: 'nvarchar', length: 255 })
  email: string

  @Column({ name: 'avatar', type: 'text', nullable: true })
  avatar: string

  @Column({ name: 'user_name', type: 'nvarchar', length: 255 })
  userName: string

  @Column({ name: 'phone', type: 'nvarchar', length: 255, nullable: true })
  phone: string

  @Column({ name: 'date_of_birth', type: 'datetime' })
  dateOfBirth: Date

  @Column({ name: 'gender', type: 'int' })
  gender: GenderEnum

  @Column({ name: 'role', type: 'int' })
  role: UserRoleEnum

  @Column({ name: 'status', type: 'int', default: AccountStatusEnum.NORMAL })
  status: AccountStatusEnum
}
