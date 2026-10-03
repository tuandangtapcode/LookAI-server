import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator'
import { OutfitAdviceRatingEnum } from '../outfit-advice.enum'

export class RefineOutfitAdviceDTO {
  @IsNotEmpty()
  @IsUUID()
  outfitAdviceId: string

  @IsNotEmpty()
  @IsEnum(OutfitAdviceRatingEnum)
  rating: OutfitAdviceRatingEnum

  @IsOptional()
  @IsString()
  @MaxLength(500)
  feedback?: string
}
