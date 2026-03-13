import { IsNotEmpty, IsUUID } from 'class-validator'
import { CreateExpenseDTO } from './create-expense.dto'

export class UpdateExpenseDTO extends CreateExpenseDTO {
  @IsNotEmpty()
  @IsUUID()
  expenseId: string
}
