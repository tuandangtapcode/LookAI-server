import { Type } from 'class-transformer'
import { IsEnum, IsOptional } from 'class-validator'
import { BooleanEnum } from 'src/common/enum/common'

export class GetListPackageDto {
  @IsOptional()
  @Type(() => Number)
  @IsEnum(BooleanEnum)
  isActive?: BooleanEnum
}
