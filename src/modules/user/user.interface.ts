import { AccountStatusEnum, GenderEnum, UserRoleEnum } from 'src/utils/enum/user'
import { IBaseData } from '../common/base.interface'
import { IUserSubscription } from '../user-subscription/user-subscription.interface'

export interface IUser extends IBaseData {
  email: string
  avatar?: string
  userName: string
  phone?: string
  dateOfBirth: string
  gender: GenderEnum
  height?: number
  weight?: number
  bust?: number
  waist?: number
  hip?: number
  clothingSize?: string
  role: UserRoleEnum
  status: AccountStatusEnum
  subscription: IUserSubscription
}
