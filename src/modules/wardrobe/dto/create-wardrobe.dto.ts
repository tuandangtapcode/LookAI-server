import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator'
import { BooleanEnum, ItemCategoryEnum } from 'src/utils/enum/common'

export class CreateWardrobeDTO {
  @IsNotEmpty()
  @IsString()
  name: string

  @IsOptional()
  @IsUUID()
  itemTypeId: string

  @IsNotEmpty()
  @IsEnum(ItemCategoryEnum)
  itemCategory: ItemCategoryEnum

  @IsNotEmpty()
  @IsString()
  image: string

  @IsNotEmpty()
  @IsString()
  color: string

  @IsOptional()
  @IsString()
  size: string

  @IsNotEmpty()
  @IsEnum(BooleanEnum)
  isFavourite: BooleanEnum
}
