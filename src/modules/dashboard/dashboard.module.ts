import { Module } from '@nestjs/common'
import { ExpenseModule } from '../expense/expense.module'
import { OutfitAdviceModule } from '../outfit-advice/outfit-advice.module'
import { PaymentModule } from '../payment/payment.module'
import { DashboardController } from './dashboard.controller'
import { DashboardService } from './dashboard.service'

@Module({
  controllers: [DashboardController],
  providers: [DashboardService],
  imports: [OutfitAdviceModule, ExpenseModule, PaymentModule]
})
export class DashboardModule {}
