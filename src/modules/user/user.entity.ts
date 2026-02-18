import { AccountStatusEnum, GenderEnum, UserRoleEnum } from 'src/utils/enum/user'
import { Column, Entity, OneToOne } from 'typeorm'
import BaseModel from '../common/base'
import { UserSubscriptionEntity } from '../user-subscription/user-subscription.entity'

@Entity({ name: 'user', schema: 'public' })
export class UserEntity extends BaseModel {
  @Column({ name: 'email', type: 'nvarchar', length: 255 })
  email: string

  @Column({ name: 'avatar', type: 'text', nullable: true })
  avatar: string

  @Column({ name: 'user_name', type: 'nvarchar', length: 255 })
  userName: string

  @Column({ name: 'phone', type: 'varchar', length: 10, nullable: true })
  phone: string

  @Column({ name: 'date_of_birth', type: 'datetime' })
  dateOfBirth: Date

  @Column({ name: 'gender', type: 'int' })
  gender: GenderEnum

  @Column({ name: 'height', type: 'int', nullable: true })
  height: number

  @Column({ name: 'weight', type: 'int', nullable: true })
  weight: number

  @Column({ name: 'bust', type: 'int', nullable: true })
  bust: number

  @Column({ name: 'waist', type: 'int', nullable: true })
  waist: number

  @Column({ name: 'hip', type: 'int', nullable: true })
  hip: number

  @Column({ name: 'clothing_size', type: 'varchar', nullable: true })
  clothingSize: string

  @Column({ name: 'role', type: 'int' })
  role: UserRoleEnum

  @Column({ name: 'status', type: 'int', default: AccountStatusEnum.NORMAL })
  status: AccountStatusEnum

  @OneToOne(() => UserSubscriptionEntity, (userSubscription) => userSubscription.user)
  subscription: UserSubscriptionEntity
}
