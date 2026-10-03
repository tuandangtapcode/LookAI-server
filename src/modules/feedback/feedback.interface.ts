import { IBaseData } from '../common/base.interface'
import { IUser } from '../user/user.interface'
import { FeedbackStatusEnum, FeedbackTypeEnum } from './feedback.enum'

export interface IFeedback extends IBaseData {
  type: FeedbackTypeEnum
  content: string
  status: FeedbackStatusEnum
  user: IUser
}
