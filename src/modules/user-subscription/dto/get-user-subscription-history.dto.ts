import { IsNotEmpty, IsString } from 'class-validator'
import { PaginationDTO } from 'src/modules/common/dto/pagination.dto'

export class GetUserSubscriptionHistoryDTO extends PaginationDTO {
  @IsNotEmpty()
  @IsString()
  userId: string
}
