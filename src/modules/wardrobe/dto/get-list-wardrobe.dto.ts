import { Type } from 'class-transformer'
import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator'
import { BooleanEnum } from 'src/modules/common/common.enum'
import { PaginationDTO } from 'src/modules/common/dto/pagination.dto'
import { ItemCategoryEnum } from 'src/modules/item-type/item-type.enum'

export class GetListWardrobeDTO extends PaginationDTO {
  @IsNotEmpty()
  @Type(() => Number)
  @IsEnum(ItemCategoryEnum)
  itemCategory: ItemCategoryEnum

  @IsOptional()
  @IsUUID()
  itemTypeId?: string

  @IsOptional()
  @IsString()
  color?: string

  @IsOptional()
  @IsString()
  size?: string

  @IsOptional()
  @Type(() => Number)
  @IsEnum(BooleanEnum)
  isFavourite?: BooleanEnum
}
