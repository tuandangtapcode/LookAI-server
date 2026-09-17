import { IsEnum, IsNotEmpty, IsString } from 'class-validator'
import { ItemCategoryEnum } from 'src/common/enum/common'

export class CreateItemTypeDTO {
  @IsNotEmpty()
  @IsString()
  name: string

  @IsNotEmpty()
  @IsEnum(ItemCategoryEnum)
  category: ItemCategoryEnum
}
