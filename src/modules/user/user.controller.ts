import { Body, Controller, Get, Post, Put, Query, Req, UseGuards } from '@nestjs/common'
import type { Request } from 'express'
import { Roles } from 'src/common/decorators/role.decorator'
import { UserRoleEnum } from 'src/common/enum/user'
import { AuthGuard } from 'src/common/guards/auth.guard'
import { RoleGuard } from 'src/common/guards/role.guard'
import { GetListUserDTO } from './dto/get-list-user.dto'
import { UpdateProfileDTO } from './dto/update-profile.dto'
import { UserService } from './user.service'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/admin')
  async createAdminUser() {
    return await this.userService.createAdminUser()
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(UserRoleEnum.USER, UserRoleEnum.STYLIST)
  @Put()
  async updateProfile(@Req() req: Request, @Body() body: UpdateProfileDTO) {
    return await this.userService.updateProfile(req, body)
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(UserRoleEnum.ADMIN)
  @Get()
  async getListUser(@Query() query: GetListUserDTO) {
    return await this.userService.getListUser(query)
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(UserRoleEnum.ADMIN)
  @Get(':userId')
  async getDetailUser(@Req() req: Request) {
    return await this.userService.getDetailUser(req)
  }
}
