import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator'
import { OutfitAdviceRatingEnum } from 'src/common/enum/outfit-advice'

export class RefineOutfitAdviceDTO {
  @IsNotEmpty()
  @IsUUID()
  outfitAdviceId: string

  @IsNotEmpty()
  @IsEnum(OutfitAdviceRatingEnum)
  rating: OutfitAdviceRatingEnum

  @IsOptional()
  @IsString()
  feedback?: string
}
