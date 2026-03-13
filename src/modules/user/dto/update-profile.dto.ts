import { IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'
import { GenderEnum } from 'src/utils/enum/user'

export class UpdateProfileDTO {
  @IsOptional()
  @IsString()
  avatar?: string

  @IsNotEmpty()
  @IsString()
  userName: string

  @IsOptional()
  @IsString()
  phone?: string

  @IsNotEmpty()
  @IsDateString()
  dateOfBirth: Date

  @IsNotEmpty()
  @IsEnum(GenderEnum)
  gender: GenderEnum

  @IsOptional()
  @IsNumber()
  height?: number

  @IsOptional()
  @IsNumber()
  weight?: number

  @IsOptional()
  @IsNumber()
  bust?: number

  @IsOptional()
  @IsNumber()
  waist?: number

  @IsOptional()
  @IsNumber()
  hip?: number

  @IsOptional()
  @IsString()
  clothingSize?: string

  @IsOptional()
  @IsString()
  skinColor?: string

  @IsOptional()
  @IsString()
  currentStyle?: string

  @IsOptional()
  @IsString()
  desiredStyle?: string

  @IsOptional()
  @IsString()
  occupation?: string

  @IsOptional()
  @IsString()
  place?: string
}
