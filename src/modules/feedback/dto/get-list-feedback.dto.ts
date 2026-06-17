import { Type } from 'class-transformer'
import { IsEnum, IsOptional } from 'class-validator'
import { PaginationDTO } from 'src/modules/common/dto/pagination.dto'
import { FeedbackStatusEnum, FeedbackTypeEnum } from 'src/utils/enum/feedback'

export class GetListFeedbackDTO extends PaginationDTO {
  @IsOptional()
  @Type(() => Number)
  @IsEnum(FeedbackTypeEnum)
  type?: FeedbackTypeEnum

  @IsOptional()
  @Type(() => Number)
  @IsEnum(FeedbackStatusEnum)
  status?: FeedbackStatusEnum
}
