import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common'
import type { Request } from 'express'
import { Roles } from 'src/decorators/role.decorator'
import { AuthGuard } from 'src/guards/auth.guard'
import { RoleGuard } from 'src/guards/role.guard'
import { UserRoleEnum } from 'src/utils/enum/user'
import { CreateOutfitAdviceDTO } from './dto/create-outfit-advice.dto'
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
}
