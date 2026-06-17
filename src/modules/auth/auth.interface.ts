import { UserRoleEnum } from 'src/utils/enum/user'

export interface ITokenData {
  id: string
  name: string
  role: UserRoleEnum
}
