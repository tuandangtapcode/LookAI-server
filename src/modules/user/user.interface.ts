import { AccountStatusEnum, GenderEnum, UserRoleEnum } from 'src/utils/enum/user'
import { IBaseData } from '../common/base.interface'

export interface IUser extends IBaseData {
  email: string
  avatar: string
  userName: string
  phone?: string
  dateOfBirth: string
  gender: GenderEnum
  status: AccountStatusEnum
  role: UserRoleEnum
}
