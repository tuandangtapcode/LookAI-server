import { Type } from 'class-transformer'
import { IsEnum, IsOptional } from 'class-validator'
import { BooleanEnum } from 'src/modules/common/common.enum'

export class GetListPackageDto {
  @IsOptional()
  @Type(() => Number)
  @IsEnum(BooleanEnum)
  isActive?: BooleanEnum
}
