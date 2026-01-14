import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common'
import type { Request, Response } from 'express'
import { Roles } from 'src/decorators/role.decorator'
import { AuthGuard } from 'src/guards/auth.guard'
import { RoleGuard } from 'src/guards/role.guard'
import { UserRoleEnum } from 'src/utils/enum/user'
import { AuthService } from './auth.service'
import { LoginDTO } from './dto/login.dto'
import { RegisterDTO } from './dto/register.dto'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() body: RegisterDTO, @Res({ passthrough: true }) res: Response) {
    return await this.authService.register(body, res)
  }

  @Post('login')
  async login(@Body() body: LoginDTO, @Res({ passthrough: true }) res: Response) {
    return await this.authService.login(body, res)
  }

  @Get('check-auth')
  checkAuth(@Req() req: Request) {
    return this.authService.checkAuth(req)
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.USER, UserRoleEnum.STYLIST)
  @Get('me')
  async getDetailProfile(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return this.authService.getDetailProfile(req, res)
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.USER, UserRoleEnum.STYLIST)
  @Get('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    return this.authService.logout(res)
  }
}
