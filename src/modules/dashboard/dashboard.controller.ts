import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { Roles } from 'src/common/decorators/role.decorator'
import { UserRoleEnum } from 'src/common/enum/user'
import { AuthGuard } from 'src/common/guards/auth.guard'
import { RoleGuard } from 'src/common/guards/role.guard'
import { StatisticDTO } from '../common/dto/statistic.dto'
import { DashboardService } from './dashboard.service'

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(UserRoleEnum.ADMIN)
  @Get('statistic-token-used')
  async statisticTokenUsed(@Query() query: StatisticDTO) {
    return this.dashboardService.statisticTokenUsed(query)
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(UserRoleEnum.ADMIN)
  @Get('statistic-financial')
  async statisticFinancial(@Query() query: StatisticDTO) {
    return this.dashboardService.statisticFinancial(query)
  }
}
