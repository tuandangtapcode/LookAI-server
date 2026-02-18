import { IsNotEmpty, IsUUID } from 'class-validator'
import { CreateWardrobeDTO } from './create-wardrobe.dto'

export class UpdateWardrobeDTO extends CreateWardrobeDTO {
  @IsNotEmpty()
  @IsUUID()
  wardrobeId: string
}
