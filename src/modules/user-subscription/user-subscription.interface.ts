import { SubscriptionHistoryStatusEnum } from 'src/utils/enum/subscription-history'
import { UserSubscriptionStatusEnum } from 'src/utils/enum/user-subscription'
import { IBaseData } from '../common/base.interface'
import { PackageEntity } from '../package/package.entity'
import { IPackage } from '../package/package.interface'
import { IUser } from '../user/user.interface'

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
