import { Body, Controller, Get, Put, Query, Req, UseGuards } from '@nestjs/common'
import type { Request } from 'express'
import { Roles } from 'src/common/decorators/role.decorator'
import { UserRoleEnum } from 'src/common/enum/user'
import { AuthGuard } from 'src/common/guards/auth.guard'
import { RoleGuard } from 'src/common/guards/role.guard'
import { GetUserSubscriptionHistoryDTO } from './dto/get-user-subscription-history.dto'
import { UpdateUserSubscriptionDTO } from './dto/update-user-subscription.dto'
import { UserSubscriptionService } from './user-subscription.service'

@Controller('user-subscription')
export class UserSubscriptionController {
  constructor(private readonly userSubscriptionService: UserSubscriptionService) {}

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(UserRoleEnum.USER)
  @Get('me')
  async getSubscriptionByUser(@Req() req: Request) {
    return await this.userSubscriptionService.getSubscriptionByUser(req)
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(UserRoleEnum.USER)
  @Put()
  async updateSubscription(@Req() req: Request, @Body() body: UpdateUserSubscriptionDTO) {
    return await this.userSubscriptionService.updateSubscription(req, body)
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(UserRoleEnum.ADMIN)
  @Get('history')
  async getUserSubscriptionHistory(@Query() query: GetUserSubscriptionHistoryDTO) {
    return await this.userSubscriptionService.getUserSubscriptionHistory(query)
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(UserRoleEnum.ADMIN)
  @Get(':userId')
  async getDetailUserSubscription(@Req() req: Request) {
    return await this.userSubscriptionService.getDetailUserSubscription(req)
  }
}
