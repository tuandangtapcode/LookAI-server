import { IsDateString, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { GenderEnum } from 'src/utils/enum/user'

export class RegisterDTO {
  @IsEmail()
  @IsNotEmpty()
  email: string

  @IsString()
  @IsOptional()
  avatar: string

  @IsString()
  @IsNotEmpty()
  userName: string

  @IsString()
  @IsOptional()
  phone: string

  @IsDateString()
  @IsNotEmpty()
  dateOfBirth: Date

  @IsEnum(GenderEnum)
  @IsNotEmpty()
  gender: GenderEnum
}
