import { Body, Controller, Get, Post, Put, Query, Req, UseGuards } from '@nestjs/common'
import type { Request } from 'express'
import { Roles } from 'src/decorators/role.decorator'
import { AuthGuard } from 'src/guards/auth.guard'
import { RoleGuard } from 'src/guards/role.guard'
import { UserRoleEnum } from 'src/utils/enum/user'
import { CreateFeedbackDTO } from './dto/create-feedback.dto'
import { GetListFeedbackDTO } from './dto/get-list-feedback.dto'
import { UpdateFeedbackDTO } from './dto/update-feedback.dto'
import { FeedbackService } from './feedback.service'

@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(UserRoleEnum.USER, UserRoleEnum.STYLIST)
  @Post()
  async createFeedback(@Req() req: Request, @Body() body: CreateFeedbackDTO) {
    return await this.feedbackService.createFeedback(req, body)
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(UserRoleEnum.USER, UserRoleEnum.STYLIST, UserRoleEnum.ADMIN)
  @Put()
  async updateFeedback(@Req() req: Request, @Body() body: UpdateFeedbackDTO) {
    return await this.feedbackService.updateFeedback(req, body)
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(UserRoleEnum.ADMIN)
  @Get()
  async getListFeedback(@Query() query: GetListFeedbackDTO) {
    return await this.feedbackService.getListFeedback(query)
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(UserRoleEnum.USER, UserRoleEnum.STYLIST)
  @Get('by-user')
  async getListFeedbackByUser(@Req() req: Request, @Query() query: GetListFeedbackDTO) {
    return await this.feedbackService.getListFeedbackByUser(req, query)
  }
}
