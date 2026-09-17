import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common'
import { Roles } from 'src/common/decorators/role.decorator'
import { UserRoleEnum } from 'src/common/enum/user'
import { AuthGuard } from 'src/common/guards/auth.guard'
import { RoleGuard } from 'src/common/guards/role.guard'
import { CreateLogDTO } from './dto/create-log.dto'
import { GetListLogDTO } from './dto/get-list-log.dto'
import { LogService } from './log.service'

@Controller('log')
export class LogController {
  constructor(private readonly logService: LogService) {}

  @Post()
  async createLog(@Body() body: CreateLogDTO) {
    return await this.logService.createLog(body)
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(UserRoleEnum.ADMIN)
  @Get()
  async getListLog(@Query() query: GetListLogDTO) {
    return await this.logService.getListLog(query)
  }
}
