import { ExpenseTypeEnum } from './expense.enum'

export interface IExpenseByType {
  type: ExpenseTypeEnum
  totalAmount: number
}
