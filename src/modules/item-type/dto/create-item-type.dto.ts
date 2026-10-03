import { IsEnum, IsNotEmpty, IsString } from 'class-validator'
import { ItemCategoryEnum } from '../item-type.enum'

export class CreateItemTypeDTO {
  @IsNotEmpty()
  @IsString()
  name: string

  @IsNotEmpty()
  @IsEnum(ItemCategoryEnum)
  category: ItemCategoryEnum
}
