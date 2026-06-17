import { PartialType } from '@nestjs/mapped-types'
import { IsEnum, IsNotEmpty, IsOptional, IsUUID } from 'class-validator'
import { FeedbackStatusEnum } from 'src/utils/enum/feedback'
import { CreateFeedbackDTO } from './create-feedback.dto'

export class UpdateFeedbackDTO extends PartialType(CreateFeedbackDTO) {
  @IsNotEmpty()
  @IsUUID()
  feedbackId: string

  @IsOptional()
  @IsEnum(FeedbackStatusEnum)
  status?: FeedbackStatusEnum
}
