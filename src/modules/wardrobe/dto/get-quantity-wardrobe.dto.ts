import { IsNotEmpty, IsString } from 'class-validator'

export class GetQuantityWardrobeDTO {
  @IsNotEmpty()
  @IsString()
  field: 'item_category' | 'item_type'
}
