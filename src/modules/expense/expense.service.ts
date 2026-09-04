import { Injectable } from '@nestjs/common'
import HTTP_RESPONSE from 'src/utils/const/http-response'
import { response } from 'src/utils/helper/common'
import { CreateExpenseDTO } from './dto/create-expense.dto'
import { GetListExpenseDTO } from './dto/get-list-expense.dto'
import { UpdateExpenseDTO } from './dto/update-expense.dto'
import { ExpenseRepository } from './expense.repository'

@Injectable()
export class ExpenseService {
  constructor(private readonly expenseRepository: ExpenseRepository) {}

  async createExpense(body: CreateExpenseDTO) {
    await this.expenseRepository.insertOne(body)

    return response({}, false, HTTP_RESPONSE.EXPENSE.CREATE_EXPENSE_SUCCESS)
  }

  async updateExpense(body: UpdateExpenseDTO) {
    const { expenseId, ...rest } = body

    const expense = await this.expenseRepository.findOne({ id: expenseId })
    if (!expense) return response({}, true, HTTP_RESPONSE.EXPENSE.EXPENSE_NOT_EXIST)

    await this.expenseRepository.updateOne(expense, rest)

    return response({}, false, HTTP_RESPONSE.EXPENSE.UPDATE_EXPENSE_SUCCESS)
  }

  async getListExpense(params: GetListExpenseDTO) {
    const expenses = await this.expenseRepository.getListExpense(params)

    return response(expenses, false, HTTP_RESPONSE.COMMON.GET_DATA_SUCCESS)
  }
}
