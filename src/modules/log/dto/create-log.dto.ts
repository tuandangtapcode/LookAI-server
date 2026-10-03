import { IsEnum, IsNotEmpty, IsString } from 'class-validator'
import { LogServiceEnum, LogTypeEnum } from '../log.enum'

export class CreateLogDTO {
  @IsNotEmpty()
  @IsEnum(LogServiceEnum)
  service: LogServiceEnum

  @IsNotEmpty()
  @IsEnum(LogTypeEnum)
  type: LogTypeEnum

  @IsNotEmpty()
  @IsString()
  title: string

  @IsNotEmpty()
  @IsString()
  message: string

  @IsNotEmpty()
  @IsString()
  detail: string

  @IsNotEmpty()
  @IsString()
  endpoint: string
}
