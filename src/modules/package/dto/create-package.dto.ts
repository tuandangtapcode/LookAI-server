import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'

export class CreatePackageDto {
  @IsNotEmpty()
  @IsString()
  name: string

  @IsOptional()
  @IsNumber()
  duration?: number

  @IsNotEmpty()
  @IsNumber()
  price: number

  @IsNotEmpty()
  @IsNumber()
  quota: number

  @IsNotEmpty()
  @IsString()
  description: string
}
