import { Body, Controller, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common'
import { Roles } from 'src/decorators/role.decorator'
import { AuthGuard } from 'src/guards/auth.guard'
import { RoleGuard } from 'src/guards/role.guard'
import { UserRoleEnum } from 'src/utils/enum/user'
import { CreatePackageDto } from './dto/create-package.dto'
import { GetListPackageDto } from './dto/get-list-package.dto'
import { UpdatePackageDto } from './dto/update-package.dto'
import { PackageService } from './package.service'

@Controller('package')
export class PackageController {
  constructor(private readonly packageService: PackageService) {}

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(UserRoleEnum.ADMIN)
  @Post()
  async createPackage(@Body() body: CreatePackageDto) {
    return await this.packageService.createPackage(body)
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(UserRoleEnum.ADMIN)
  @Put()
  async updatePackage(@Body() body: UpdatePackageDto) {
    return await this.packageService.updatePackage(body)
  }

  @Get()
  async getListPackage(@Query() query: GetListPackageDto) {
    return await this.packageService.getListPackage(query)
  }

  @Get('/:packageId')
  async getDetailPackage(@Param('packageId') packageId: string) {
    return await this.packageService.getDetailPackage(packageId)
  }
}
