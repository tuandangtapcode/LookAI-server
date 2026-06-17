import { PartialType } from '@nestjs/mapped-types'
import { IsNotEmpty, IsUUID } from 'class-validator'
import { CreateExpenseDTO } from './create-expense.dto'

export class UpdateExpenseDTO extends PartialType(CreateExpenseDTO) {
  @IsNotEmpty()
  @IsUUID()
  expenseId: string
}
