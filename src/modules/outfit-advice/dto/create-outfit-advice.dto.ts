import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator'
import { GenderEnum } from 'src/utils/enum/user'

export class CreateOutfitAdviceDTO {
  @IsNotEmpty()
  @IsNumber()
  height: number

  @IsNotEmpty()
  @IsNumber()
  weight: number

  @IsNotEmpty()
  @IsString()
  clothingSize: string

  @IsNotEmpty()
  @IsString()
  skinColor: string

  @IsNotEmpty()
  @IsEnum(GenderEnum)
  gender: GenderEnum

  @IsNotEmpty()
  @IsNumber()
  age: number

  @IsNotEmpty()
  @IsString()
  fashionStyle: string

  @IsNotEmpty()
  @IsString()
  occasion: string
}
