import { IBaseData } from '../common/base.interface'
import { PackageEntity } from '../package/package.entity'
import { IPackage } from '../package/package.interface'
import { SubscriptionHistoryStatusEnum } from '../subscription-history/subscription-history.enum'
import { IUser } from '../user/user.interface'
import { UserSubscriptionStatusEnum } from './user-subscription.enum'

export interface IUserSubscription extends IBaseData {
  user: IUser
  package: IPackage
  startDate: Date
  endDate: Date
  quota: number
  usedQuota: number
  status: UserSubscriptionStatusEnum
}

export interface IUserSubscriptionHistory extends IBaseData {
  package: PackageEntity
  status: SubscriptionHistoryStatusEnum
}
