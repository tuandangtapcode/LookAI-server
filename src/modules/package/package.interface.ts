import { BooleanEnum } from 'src/common/enum/common'
import { IBaseData } from '../common/base.interface'

export interface IPackage extends IBaseData {
  name: string
  duration?: number
  price: number
  quota: number
  refine: number
  description: string
  isActive: BooleanEnum
}
