import { UserSubscriptionStatusEnum } from 'src/utils/enum/user-subscription'
import { BeforeInsert, Column, Entity, JoinColumn, OneToOne } from 'typeorm'
import BaseModel from '../common/base'
import { PackageEntity } from '../package/package.entity'
import { UserEntity } from '../user/user.entity'

@Entity({ name: 'user_subscription', schema: 'public' })
export class UserSubscriptionEntity extends BaseModel {
  @Column({ name: 'user_id', type: 'uuid' })
  userId: string

  @Column({ name: 'package_id', type: 'uuid' })
  packageId: string

  @Column({ name: 'start_date', type: 'datetime', default: () => 'NOW()' })
  startDate: Date

  @Column({ name: 'end_date', type: 'datetime' })
  endDate: Date

  @Column({ name: 'quota', type: 'int' })
  quota: number

  @Column({ name: 'used_quota', type: 'int', default: 0 })
  usedQuota: number

  @Column({ name: 'status', type: 'int', default: UserSubscriptionStatusEnum.ACTIVE })
  status: UserSubscriptionStatusEnum

  @OneToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity

  @OneToOne(() => PackageEntity)
  @JoinColumn({ name: 'package_id' })
  package: PackageEntity

  @BeforeInsert()
  setDates() {
    if (!this.startDate) {
      this.startDate = new Date()
    }
    if (!this.endDate) {
      this.endDate = new Date(this.startDate)
      this.endDate.setMonth(this.endDate.getMonth() + 1)
    }
  }
}
