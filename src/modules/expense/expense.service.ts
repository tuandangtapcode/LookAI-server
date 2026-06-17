import { Injectable, InternalServerErrorException } from '@nestjs/common'
import HTTP_RESPONSE from 'src/utils/const/http-response'
import { response } from 'src/utils/helper/common'
import { logError } from 'src/utils/helper/log'
import { LogRepository } from '../log/log.repository'
import { CreateExpenseDTO } from './dto/create-expense.dto'
import { GetListExpenseDTO } from './dto/get-list-expense.dto'
import { UpdateExpenseDTO } from './dto/update-expense.dto'
import { ExpenseRepository } from './expense.repository'

@Injectable()
export class ExpenseService {
  constructor(
    private readonly expenseRepository: ExpenseRepository,
    private readonly logRepository: LogRepository
  ) {}

  async createExpense(body: CreateExpenseDTO) {
    try {
      await this.expenseRepository.insertOne(body)

      return response({}, false, HTTP_RESPONSE.EXPENSE.CREATE_EXPENSE_SUCCESS)
    } catch (error: any) {
      this.logRepository.insertOne(logError({ method: 'Expense Service-createExpense', error }))
      throw new InternalServerErrorException(error.message)
    }
  }

  async updateExpense(body: UpdateExpenseDTO) {
    try {
      const { expenseId, ...rest } = body

      const expense = await this.expenseRepository.findOne({ id: expenseId })
      if (!expense) return response({}, true, HTTP_RESPONSE.EXPENSE.EXPENSE_NOT_EXIST)

      await this.expenseRepository.updateOne(expense, rest)

      return response({}, false, HTTP_RESPONSE.EXPENSE.UPDATE_EXPENSE_SUCCESS)
    } catch (error: any) {
      this.logRepository.insertOne(logError({ method: 'Expense Service-updateExpense', error }))
      throw new InternalServerErrorException(error.message)
    }
  }

  async getListExpense(params: GetListExpenseDTO) {
    try {
      const expenses = await this.expenseRepository.getListExpense(params)

      return response(expenses, false, HTTP_RESPONSE.COMMON.GET_DATA_SUCCESS)
    } catch (error: any) {
      this.logRepository.insertOne(logError({ method: 'Expense Service-getListExpense', error }))
      throw new InternalServerErrorException(error.message)
    }
  }
}
