import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common'
import type { Request } from 'express'
import { Roles } from 'src/common/decorators/role.decorator'
import { UserRoleEnum } from 'src/common/enum/user'
import { AuthGuard } from 'src/common/guards/auth.guard'
import { RoleGuard } from 'src/common/guards/role.guard'
import { CreateOutfitAdviceDTO } from './dto/create-outfit-advice.dto'
import { GetListOutfitAdviceDTO } from './dto/get-list-outfit-advice.dto'
import { RefineOutfitAdviceDTO } from './dto/refine-outfit-advice.dto'
import { OutfitAdviceService } from './outfit-advice.service'

@Controller('outfit-advice')
export class OutfitAdviceController {
  constructor(private readonly outfitAdviceService: OutfitAdviceService) {}

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(UserRoleEnum.USER)
  @Post()
  async createOutfitAdvice(@Req() req: Request, @Body() body: CreateOutfitAdviceDTO) {
    return await this.outfitAdviceService.createOutfitAdvice(req, body)
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(UserRoleEnum.USER)
  @Post('refine')
  async refineOutfitAdvice(@Req() req: Request, @Body() body: RefineOutfitAdviceDTO) {
    return await this.outfitAdviceService.refineOutfitAdvice(req, body)
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(UserRoleEnum.ADMIN)
  @Get()
  async getListOutfitAdvice(@Query() query: GetListOutfitAdviceDTO) {
    return await this.outfitAdviceService.getListOutfitAdvice(query)
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(UserRoleEnum.USER)
  @Get('me')
  async getListOutfitAdviceByUser(@Req() req: Request) {
    return await this.outfitAdviceService.getListOutfitAdviceByUser(req)
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(UserRoleEnum.USER)
  @Get(':outfitAdviceId')
  async getDetailOutfitAdvice(@Req() req: Request) {
    return await this.outfitAdviceService.getDetailOutfitAdvice(req)
  }
}
