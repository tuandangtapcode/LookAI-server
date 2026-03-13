import { Type } from 'class-transformer'
import { IsIn, IsNotEmpty, IsNumber, IsOptional, ValidateIf } from 'class-validator'

export class StatisticDTO {
  @IsOptional()
  @Type(() => Number)
  @IsIn([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
  forMonth?: number

  @ValidateIf((o) => !!o.forMonth)
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  forYear?: number
}
