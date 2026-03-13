import { Type } from 'class-transformer'
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'

export class PaginationDTO {
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  pageSize: number

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  currentPage: number

  @IsOptional()
  @IsString()
  textSearch?: string
}
