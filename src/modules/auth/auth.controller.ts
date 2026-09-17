import { Body, Controller, Get, HttpCode, Post, Req, Res, UseGuards } from '@nestjs/common'
import type { Request, Response } from 'express'
import { Roles } from 'src/common/decorators/role.decorator'
import { UserRoleEnum } from 'src/common/enum/user'
import { AuthGuard } from 'src/common/guards/auth.guard'
import { RoleGuard } from 'src/common/guards/role.guard'
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
  @HttpCode(200)
  async login(@Body() body: LoginDTO, @Res({ passthrough: true }) res: Response) {
    return await this.authService.login(body, res)
  }

  @Get('check-auth')
  checkAuth(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return this.authService.checkAuth(req, res)
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
