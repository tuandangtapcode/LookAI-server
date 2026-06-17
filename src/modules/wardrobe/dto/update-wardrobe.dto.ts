import { PartialType } from '@nestjs/mapped-types'
import { IsNotEmpty, IsUUID } from 'class-validator'
import { CreateWardrobeDTO } from './create-wardrobe.dto'

export class UpdateWardrobeDTO extends PartialType(CreateWardrobeDTO) {
  @IsNotEmpty()
  @IsUUID()
  wardrobeId: string
}
