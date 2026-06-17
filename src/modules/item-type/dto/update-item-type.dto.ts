import { PartialType } from '@nestjs/mapped-types'
import { IsNotEmpty, IsUUID } from 'class-validator'
import { CreateItemTypeDTO } from './create-item-type.dto'

export class UpdateItemTypeDTO extends PartialType(CreateItemTypeDTO) {
  @IsNotEmpty()
  @IsUUID()
  itemTypeId: string
}
