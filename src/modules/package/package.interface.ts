import { BooleanEnum } from 'src/utils/enum/common'
import { IBaseData } from '../common/base.interface'

export interface IPackage extends IBaseData {
  name: string
  duration?: number
  price: number
  quota: number
  description: string
  isActive: BooleanEnum
}
