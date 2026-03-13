import { ExpenseTypeEnum } from 'src/utils/enum/expense'

export interface IExpenseByType {
  type: ExpenseTypeEnum
  totalAmount: number
}

export interface ICalculateExpense {
  total: number
  analysis: IExpenseByType[]
}
