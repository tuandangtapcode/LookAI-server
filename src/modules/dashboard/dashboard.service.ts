import { Injectable, InternalServerErrorException } from '@nestjs/common'
import HTTP_RESPONSE from 'src/utils/const/http-response'
import { response } from 'src/utils/helper/common'
import { logError } from 'src/utils/helper/log'
import { StatisticDTO } from '../common/dto/statistic.dto'
import { ExpenseRepository } from '../expense/expense.repository'
import { LogRepository } from '../log/log.repository'
import { OutfitAdviceRepository } from '../outfit-advice/outfit-advice.repository'
import { PaymentRepository } from '../payment/payment.repository'

@Injectable()
export class DashboardService {
  constructor(
    private readonly outfitAdviceRepository: OutfitAdviceRepository,
    private readonly expenseRepository: ExpenseRepository,
    private readonly paymentRepository: PaymentRepository,
    private readonly logRepository: LogRepository
  ) {}

  async statisticTokenUsed(params: StatisticDTO) {
    try {
      const [tokenUsed, topUserTokenUsed] = await Promise.all([
        this.outfitAdviceRepository.calculateTokenUsed(),
        this.outfitAdviceRepository.getTopTokenUsed(params)
      ])

      return response({ tokenUsed, topUserTokenUsed }, false, HTTP_RESPONSE.COMMON.GET_DATA_SUCCESS)
    } catch (error: any) {
      this.logRepository.insertOne(logError({ method: 'Dashboard Service-statisticTokenUsed', error }))
      throw new InternalServerErrorException(error.message)
    }
  }

  async statisticFinancial(params: StatisticDTO) {
    try {
      const [expense, payment] = await Promise.all([
        this.expenseRepository.calculateExpense(params),
        this.paymentRepository.calculatePayment(params)
      ])

      return response({ expense, payment }, false, HTTP_RESPONSE.COMMON.GET_DATA_SUCCESS)
    } catch (error: any) {
      this.logRepository.insertOne(logError({ method: 'Dashboard Service-statisticFinancial', error }))
      throw new InternalServerErrorException(error.message)
    }
  }
}
