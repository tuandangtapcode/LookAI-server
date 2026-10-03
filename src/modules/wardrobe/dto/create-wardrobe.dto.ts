import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator'
import { IsCloudinaryImage } from 'src/common/decorators/cloudinary-image.decorator'
import { BooleanEnum } from 'src/modules/common/common.enum'
import { ItemCategoryEnum } from 'src/modules/item-type/item-type.enum'

export class CreateWardrobeDTO {
  @IsNotEmpty()
  @IsString()
  name: string

  @IsOptional()
  @IsUUID()
  itemTypeId?: string

  @IsNotEmpty()
  @IsEnum(ItemCategoryEnum)
  itemCategory: ItemCategoryEnum

  @IsNotEmpty()
  @IsString()
  @IsCloudinaryImage()
  image: string

  @IsNotEmpty()
  @IsString()
  color: string

  @IsOptional()
  @IsString()
  size?: string

  @IsNotEmpty()
  @IsEnum(BooleanEnum)
  isFavourite: BooleanEnum
}
