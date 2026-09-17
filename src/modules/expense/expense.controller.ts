import { Body, Controller, Get, Post, Put, Query, UseGuards } from '@nestjs/common'
import { Roles } from 'src/common/decorators/role.decorator'
import { UserRoleEnum } from 'src/common/enum/user'
import { AuthGuard } from 'src/common/guards/auth.guard'
import { RoleGuard } from 'src/common/guards/role.guard'
import { CreateExpenseDTO } from './dto/create-expense.dto'
import { GetListExpenseDTO } from './dto/get-list-expense.dto'
import { UpdateExpenseDTO } from './dto/update-expense.dto'
import { ExpenseService } from './expense.service'

@Controller('expense')
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(UserRoleEnum.ADMIN)
  @Post()
  async createExpense(@Body() body: CreateExpenseDTO) {
    return await this.expenseService.createExpense(body)
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(UserRoleEnum.ADMIN)
  @Put()
  async updateExpense(@Body() body: UpdateExpenseDTO) {
    return await this.expenseService.updateExpense(body)
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(UserRoleEnum.ADMIN)
  @Get()
  async getListExpense(@Query() query: GetListExpenseDTO) {
    return await this.expenseService.getListExpense(query)
  }
}
