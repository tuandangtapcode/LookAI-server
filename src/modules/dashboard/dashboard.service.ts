import { Injectable } from '@nestjs/common'
import HTTP_RESPONSE from 'src/utils/const/http-response'
import { response } from 'src/utils/helper/common'
import { StatisticDTO } from '../common/dto/statistic.dto'
import { ExpenseRepository } from '../expense/expense.repository'
import { OutfitAdviceRepository } from '../outfit-advice/outfit-advice.repository'
import { PaymentRepository } from '../payment/payment.repository'

@Injectable()
export class DashboardService {
  constructor(
    private readonly outfitAdviceRepository: OutfitAdviceRepository,
    private readonly expenseRepository: ExpenseRepository,
    private readonly paymentRepository: PaymentRepository
  ) {}

  async statisticTokenUsed(params: StatisticDTO) {
    const [tokenUsed, topUserTokenUsed] = await Promise.all([
      this.outfitAdviceRepository.calculateTokenUsed(),
      this.outfitAdviceRepository.getTopTokenUsed(params)
    ])
    return response({ tokenUsed, topUserTokenUsed }, false, HTTP_RESPONSE.COMMON.GET_DATA_SUCCESS)
  }

  async statisticFinancial(params: StatisticDTO) {
    const [expense, payment] = await Promise.all([
      this.expenseRepository.calculateExpense(params),
      this.paymentRepository.calculatePayment(params)
    ])
    return response({ expense, payment }, false, HTTP_RESPONSE.COMMON.GET_DATA_SUCCESS)
  }
}
