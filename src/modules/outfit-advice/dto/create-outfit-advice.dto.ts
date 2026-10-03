import { IsEnum, IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator'
import { GenderEnum } from 'src/modules/user/user.enum'

export class CreateOutfitAdviceDTO {
  @IsNotEmpty()
  @IsNumber()
  height: number

  @IsNotEmpty()
  @IsNumber()
  weight: number

  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  clothingSize: string

  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  skinColor: string

  @IsNotEmpty()
  @IsEnum(GenderEnum)
  gender: GenderEnum

  @IsNotEmpty()
  @IsNumber()
  age: number

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  currentStyle: string

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  desiredStyle: string

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  occupation: string

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  place: string

  @IsNotEmpty()
  @IsString()
  @MaxLength(1000)
  occasion: string
}
