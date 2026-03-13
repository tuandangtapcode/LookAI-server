import { IsEnum, IsIn, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'
import { ExpenseTypeEnum } from 'src/utils/enum/expense'

export class CreateExpenseDTO {
  @IsNotEmpty()
  @IsNumber()
  amount: number

  @IsNotEmpty()
  @IsEnum(ExpenseTypeEnum)
  type: ExpenseTypeEnum

  @IsOptional()
  @IsString()
  description?: string

  @IsNotEmpty()
  @IsIn([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
  forMonth: number

  @IsNotEmpty()
  @IsNumber()
  forYear: number
}
