import { Body, Controller, Put, Req, UseGuards } from '@nestjs/common'
import type { Request } from 'express'
import { Roles } from 'src/decorators/role.decorator'
import { AuthGuard } from 'src/guards/auth.guard'
import { RoleGuard } from 'src/guards/role.guard'
import { UserRoleEnum } from 'src/utils/enum/user'
import { UpdateProfileDTO } from './dto/update-profile.dto'
import { UserService } from './user.service'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(UserRoleEnum.USER, UserRoleEnum.STYLIST)
  @Put()
  async updateProfile(@Req() req: Request, @Body() body: UpdateProfileDTO) {
    return await this.userService.updateProfile(req, body)
  }
}
