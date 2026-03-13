import { Type } from 'class-transformer'
import { IsEnum, IsIn, IsNumber, IsOptional } from 'class-validator'
import { PaginationDTO } from 'src/modules/common/dto/pagination.dto'
import { ExpenseTypeEnum } from 'src/utils/enum/expense'

export class GetListExpenseDTO extends PaginationDTO {
  @IsOptional()
  @Type(() => Number)
  @IsIn([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
  forMonth?: number

  @IsOptional()
  @IsEnum(ExpenseTypeEnum)
  type?: ExpenseTypeEnum

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  forYear?: number
}
