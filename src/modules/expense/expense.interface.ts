import { ExpenseTypeEnum } from 'src/common/enum/expense'

export interface IExpenseByType {
  type: ExpenseTypeEnum
  totalAmount: number
}
