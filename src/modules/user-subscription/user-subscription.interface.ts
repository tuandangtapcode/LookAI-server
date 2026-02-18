import { UserSubscriptionStatusEnum } from 'src/utils/enum/user-subscription'
import { IBaseData } from '../common/base.interface'
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
