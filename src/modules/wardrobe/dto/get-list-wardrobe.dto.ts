import { Type } from 'class-transformer'
import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator'
import { BooleanEnum, ItemCategoryEnum } from 'src/utils/enum/common'

export class GetListWardrobeDTO {
  @IsNotEmpty()
  @Type(() => Number)
  @IsEnum(ItemCategoryEnum)
  itemCategory: ItemCategoryEnum

  @IsOptional()
  @IsUUID()
  itemTypeId: string

  @IsOptional()
  @IsString()
  color: string

  @IsOptional()
  @IsString()
  size: string

  @IsOptional()
  @Type(() => Number)
  @IsEnum(BooleanEnum)
  isFavourite: BooleanEnum
}
