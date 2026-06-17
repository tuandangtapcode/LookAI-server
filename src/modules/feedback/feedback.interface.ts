import { FeedbackStatusEnum, FeedbackTypeEnum } from 'src/utils/enum/feedback'
import { IBaseData } from '../common/base.interface'
import { IUser } from '../user/user.interface'

export interface IFeedback extends IBaseData {
  type: FeedbackTypeEnum
  content: string
  status: FeedbackStatusEnum
  user: IUser
}
