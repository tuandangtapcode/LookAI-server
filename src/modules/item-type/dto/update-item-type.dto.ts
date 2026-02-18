import { IsNotEmpty, IsUUID } from 'class-validator'
import { CreateItemTypeDTO } from './create-item-type.dto'

export class UpdateItemTypeDTO extends CreateItemTypeDTO {
  @IsNotEmpty()
  @IsUUID()
  itemTypeId: string
}
