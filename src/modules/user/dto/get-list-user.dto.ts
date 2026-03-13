import { Type } from 'class-transformer'
import { IsEnum, IsOptional, IsString } from 'class-validator'
import { PaginationDTO } from 'src/modules/common/dto/pagination.dto'
import { GenderEnum } from 'src/utils/enum/user'

export class GetListUserDTO extends PaginationDTO {
  @IsOptional()
  @IsString()
  yearOfBirth?: string

  @IsOptional()
  @Type(() => Number)
  @IsEnum(GenderEnum)
  gender?: GenderEnum
}
