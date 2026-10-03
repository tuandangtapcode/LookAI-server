import { Controller, Get, UseGuards } from '@nestjs/common'
import { Roles } from 'src/common/decorators/role.decorator'
import { AuthGuard } from 'src/common/guards/auth.guard'
import { RoleGuard } from 'src/common/guards/role.guard'
import { UserRoleEnum } from '../user/user.enum'
import { FileService } from './file.service'

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.USER, UserRoleEnum.STYLIST)
  @Get('upload-url')
  getUploadUrl() {
    return this.fileService.getUploadUrl()
  }
}
