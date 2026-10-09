import { UserRoleEnum } from '../user/user.enum'

export interface ITokenData {
  id: string
  name: string
  role: UserRoleEnum
  jti: string
}
