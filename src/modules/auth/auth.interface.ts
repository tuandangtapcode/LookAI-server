import { UserRoleEnum } from 'src/common/enum/user'

export interface ITokenData {
  id: string
  name: string
  role: UserRoleEnum
}
