import { IsNotEmpty, IsUUID } from 'class-validator'
import { PaginationDTO } from 'src/modules/common/dto/pagination.dto'

export class GetListOutfitAdviceDTO extends PaginationDTO {
  @IsNotEmpty()
  @IsUUID()
  userId: string
}
