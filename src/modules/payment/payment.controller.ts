import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common'
import type { Request } from 'express'
import { Roles } from 'src/common/decorators/role.decorator'
import { UserRoleEnum } from 'src/common/enum/user'
import { AuthGuard } from 'src/common/guards/auth.guard'
import { RoleGuard } from 'src/common/guards/role.guard'
import { CreatePaymentDTO } from './dto/create-payment.dto'
import { GetListPaymentDTO } from './dto/get-list-payment.dto'
import { PaymentService } from './payment.service'

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(UserRoleEnum.USER)
  @Post()
  async createPayment(@Req() req: Request, @Body() body: CreatePaymentDTO) {
    return this.paymentService.createPayment(req, body)
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(UserRoleEnum.USER)
  @Get('me')
  async getListPaymentByUser(@Req() req: Request, @Query() query: GetListPaymentDTO) {
    return this.paymentService.getListPaymentByUser(req, query)
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(UserRoleEnum.ADMIN)
  @Get()
  async getListPayment(@Query() query: GetListPaymentDTO) {
    return this.paymentService.getListPayment(query)
  }
}
