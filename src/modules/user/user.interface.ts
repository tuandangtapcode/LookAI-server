import { AccountStatusEnum, GenderEnum, UserRoleEnum } from 'src/utils/enum/user'
import { IBaseData } from '../common/base.interface'
import { IUserSubscription } from '../user-subscription/user-subscription.interface'

export interface IUser extends IBaseData {
  email: string
  avatar?: string
  userName: string
  sub: string
  phone?: string
  dateOfBirth: string
  gender: GenderEnum
  height?: number
  weight?: number
  bust?: number
  waist?: number
  hip?: number
  clothingSize?: string
  skinColor?: string
  currentStyle?: string
  desiredStyle?: string
  occupation?: string
  place?: string
  role: UserRoleEnum
  status: AccountStatusEnum
  subscription: IUserSubscription
}
