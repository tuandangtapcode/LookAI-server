import { SubscriptionHistoryStatusEnum } from 'src/utils/enum/subscription-history'
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import BaseModel from '../common/base'
import { PackageEntity } from '../package/package.entity'
import { UserEntity } from '../user/user.entity'

@Entity({ name: 'subscription_history', schema: 'public' })
export class SubscriptionHistoryEntity extends BaseModel {
  @Column({ name: 'user_id', type: 'uuid' })
  userId: string

  @Column({ name: 'package_id', type: 'uuid' })
  packageId: string

  @Column({ name: 'package_snapshot', type: 'text' })
  packageSnapshot: string

  @Column({ name: 'status', type: 'int' })
  status: SubscriptionHistoryStatusEnum

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity

  @ManyToOne(() => PackageEntity)
  @JoinColumn({ name: 'package_id' })
  package: PackageEntity
}
