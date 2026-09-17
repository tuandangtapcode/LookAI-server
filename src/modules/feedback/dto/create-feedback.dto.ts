import { IsEnum, IsNotEmpty, IsString } from 'class-validator'
import { FeedbackTypeEnum } from 'src/common/enum/feedback'

export class CreateFeedbackDTO {
  @IsNotEmpty()
  @IsString()
  content: string

  @IsNotEmpty()
  @IsEnum(FeedbackTypeEnum)
  type: FeedbackTypeEnum
}
