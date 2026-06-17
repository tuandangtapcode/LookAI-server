import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common'
import { Roles } from 'src/decorators/role.decorator'
import { AuthGuard } from 'src/guards/auth.guard'
import { RoleGuard } from 'src/guards/role.guard'
import { UserRoleEnum } from 'src/utils/enum/user'
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
