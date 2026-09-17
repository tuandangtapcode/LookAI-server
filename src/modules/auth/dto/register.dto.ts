import { IsDateString, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { GenderEnum } from 'src/common/enum/user'

export class RegisterDTO {
  @IsNotEmpty()
  @IsEmail()
  email: string

  @IsNotEmpty()
  @IsString()
  sub: string

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
}
