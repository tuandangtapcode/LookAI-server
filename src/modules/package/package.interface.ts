import { IBaseData } from '../common/base.interface'
import { BooleanEnum } from '../common/common.enum'

export interface IPackage extends IBaseData {
  name: string
  duration?: number
  price: number
  quota: number
  refine: number
  description: string
  isActive: BooleanEnum
}
