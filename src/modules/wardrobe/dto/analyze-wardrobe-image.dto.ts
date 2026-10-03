import { IsEnum, IsNotEmpty, IsString } from 'class-validator'
import { IsCloudinaryImage } from 'src/common/decorators/cloudinary-image.decorator'
import { ItemCategoryEnum } from 'src/modules/item-type/item-type.enum'

export class AnalyzeWardrobeImageDTO {
  @IsNotEmpty()
  @IsString()
  @IsCloudinaryImage()
  image: string

  @IsNotEmpty()
  @IsEnum(ItemCategoryEnum)
  itemCategory: ItemCategoryEnum
}
