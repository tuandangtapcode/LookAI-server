import { Type } from 'class-transformer'
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'

export class PaginationDTO {
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  pageSize: number

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  currentPage: number

  @IsString()
  @IsOptional()
  textSearch: string
}
