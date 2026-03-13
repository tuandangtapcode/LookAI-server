import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ExpenseController } from './expense.controller'
import { ExpenseEntity } from './expense.entity'
import { ExpenseRepository } from './expense.repository'
import { ExpenseService } from './expense.service'

@Module({
  imports: [TypeOrmModule.forFeature([ExpenseEntity])],
  controllers: [ExpenseController],
  providers: [ExpenseService, ExpenseRepository],
  exports: [ExpenseService, ExpenseRepository]
})
export class ExpenseModule {}
