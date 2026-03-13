import { IsOptional, IsString } from 'class-validator'
import { PaginationDTO } from 'src/modules/common/dto/pagination.dto'

export class GetListPaymentDTO extends PaginationDTO {
  @IsOptional()
  @IsString()
  packageName?: string

  @IsOptional()
  @IsString()
  orderCode?: string
}
