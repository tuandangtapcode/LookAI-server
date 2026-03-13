import { IsNotEmpty, IsString, IsUUID } from 'class-validator'

export class FeedbackOutfitAdviceDTO {
  @IsNotEmpty()
  @IsUUID()
  outfitAdviceId: string

  @IsNotEmpty()
  @IsString()
  feedback: string
}
