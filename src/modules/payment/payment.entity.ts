import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm'
import BaseModel from '../common/base'
import { PackageEntity } from '../package/package.entity'
import { SubscriptionHistoryEntity } from '../subscription-history/subscription-history.entity'
import { UserEntity } from '../user/user.entity'

@Entity({ name: 'payment', schema: 'public' })
export class PaymentEntity extends BaseModel {
  @Column({ name: 'user_id', type: 'uuid' })
  userId: string

  @Column({ name: 'package_id', type: 'uuid' })
  packageId: string

  @Column({ name: 'subscription_history_id', type: 'uuid' })
  subscriptionHistoryId: string

  @Column({ name: 'amount', type: 'int' })
  amount: number

  @Column({ name: 'order_code', type: 'nvarchar', length: 100 })
  orderCode: string

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity

  @ManyToOne(() => PackageEntity)
  @JoinColumn({ name: 'package_id' })
  package: PackageEntity

  @OneToOne(() => SubscriptionHistoryEntity)
  @JoinColumn({ name: 'subscription_history_id' })
  subscriptionHistory: SubscriptionHistoryEntity
}
