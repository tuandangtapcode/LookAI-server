import { Type } from 'class-transformer'
import { IsEnum, IsOptional } from 'class-validator'
import { PaginationDTO } from 'src/modules/common/dto/pagination.dto'
import { LogServiceEnum, LogTypeEnum } from 'src/utils/enum/log'

export class GetListLogDTO extends PaginationDTO {
  @IsOptional()
  @Type(() => Number)
  @IsEnum(LogTypeEnum)
  type?: LogTypeEnum

  @IsOptional()
  @Type(() => Number)
  @IsEnum(LogServiceEnum)
  service?: LogServiceEnum
}
