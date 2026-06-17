import { Body, Controller, Get, Post, Put, Query, Req, UseGuards } from '@nestjs/common'
import type { Request } from 'express'
import { Roles } from 'src/decorators/role.decorator'
import { AuthGuard } from 'src/guards/auth.guard'
import { RoleGuard } from 'src/guards/role.guard'
import { UserRoleEnum } from 'src/utils/enum/user'
import { CreateWardrobeDTO } from './dto/create-wardrobe.dto'
import { GetListWardrobeDTO } from './dto/get-list-wardrobe.dto'
import { GetQuantityWardrobeDTO } from './dto/get-quantity-wardrobe.dto'
import { UpdateWardrobeDTO } from './dto/update-wardrobe.dto'
import { WardrobeService } from './wardrobe.service'

@Controller('wardrobe')
export class WardrobeController {
  constructor(private readonly wardrobeService: WardrobeService) {}

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(UserRoleEnum.USER)
  @Post()
  async createWardrobe(@Req() req: Request, @Body() body: CreateWardrobeDTO) {
    return await this.wardrobeService.createWardrobe(req, body)
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(UserRoleEnum.USER)
  @Put()
  async updateWardrobe(@Req() req: Request, @Body() body: UpdateWardrobeDTO) {
    return await this.wardrobeService.updateWardrobe(req, body)
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(UserRoleEnum.USER)
  @Get()
  async getListWardrobe(@Req() req: Request, @Query() query: GetListWardrobeDTO) {
    return await this.wardrobeService.getListWardrobe(req, query)
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(UserRoleEnum.USER)
  @Get('quantity')
  async getQuantity(@Req() req: Request, @Query() query: GetQuantityWardrobeDTO) {
    return await this.wardrobeService.getQuantity(query, req)
  }
}
