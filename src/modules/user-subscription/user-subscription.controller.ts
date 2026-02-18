import { Body, Controller, Get, Put, Req, UseGuards } from '@nestjs/common'
import type { Request } from 'express'
import { Roles } from 'src/decorators/role.decorator'
import { AuthGuard } from 'src/guards/auth.guard'
import { RoleGuard } from 'src/guards/role.guard'
import { UserRoleEnum } from 'src/utils/enum/user'
import { UpdateUserSubscriptionDTO } from './dto/update-user-subscription.dto'
import { UserSubscriptionService } from './user-subscription.service'

@Controller('user-subscription')
export class UserSubscriptionController {
  constructor(private readonly userSubscriptionService: UserSubscriptionService) {}

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(UserRoleEnum.USER)
  @Get('by-user')
  async getSubscriptionByUser(@Req() req: Request) {
    return await this.userSubscriptionService.getSubscriptionByUser(req)
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(UserRoleEnum.USER)
  @Put()
  async updateSubscription(@Req() req: Request, @Body() body: UpdateUserSubscriptionDTO) {
    return await this.userSubscriptionService.updateSubscription(req, body)
  }
}
