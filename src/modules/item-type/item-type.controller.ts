import { Body, Controller, Get, Post, Put, UseGuards } from '@nestjs/common'
import { Roles } from 'src/common/decorators/role.decorator'
import { UserRoleEnum } from 'src/common/enum/user'
import { AuthGuard } from 'src/common/guards/auth.guard'
import { RoleGuard } from 'src/common/guards/role.guard'
import { CreateItemTypeDTO } from './dto/create-item-type.dto'
import { UpdateItemTypeDTO } from './dto/update-item-type.dto'
import { ItemTypeService } from './item-type.service'

@Controller('item-type')
export class ItemTypeController {
  constructor(private readonly itemTypeService: ItemTypeService) {}

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(UserRoleEnum.ADMIN)
  @Post()
  async createItemType(@Body() body: CreateItemTypeDTO) {
    return await this.itemTypeService.createItemType(body)
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(UserRoleEnum.ADMIN)
  @Put()
  async updateItemType(@Body() body: UpdateItemTypeDTO) {
    return await this.itemTypeService.updateItemType(body)
  }

  @Get()
  async getListItemType() {
    return await this.itemTypeService.getListItemType()
  }
}
