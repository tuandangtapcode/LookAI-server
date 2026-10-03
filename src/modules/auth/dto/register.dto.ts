import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { GenderEnum } from 'src/modules/user/user.enum'

export class RegisterDTO {
  @IsNotEmpty()
  @IsString()
  code: string

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
