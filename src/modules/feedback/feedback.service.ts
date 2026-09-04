import { Injectable } from '@nestjs/common'
import { Request } from 'express'
import HTTP_RESPONSE from 'src/utils/const/http-response'
import { response } from 'src/utils/helper/common'
import { CreateFeedbackDTO } from './dto/create-feedback.dto'
import { GetListFeedbackDTO } from './dto/get-list-feedback.dto'
import { UpdateFeedbackDTO } from './dto/update-feedback.dto'
import { FeedbackRepository } from './feedback.repository'

@Injectable()
export class FeedbackService {
  constructor(private readonly feedbackRepository: FeedbackRepository) {}

  async createFeedback(req: Request, body: CreateFeedbackDTO) {
    const userId = req.user.id

    const newFeedback = await this.feedbackRepository.insertOne({
      ...body,
      userId
    })

    return response(newFeedback, false, HTTP_RESPONSE.FEEDBACK.CREATE_FEEDBACK_SUCCESS)
  }

  async updateFeedback(req: Request, body: UpdateFeedbackDTO) {
    const userId = req.user.id
    const { feedbackId, ...updateData } = body

    const feedback = await this.feedbackRepository.findOne({ id: feedbackId, userId })
    if (!feedback) return response({}, true, HTTP_RESPONSE.FEEDBACK.FEEDBACK_NOT_EXIST)

    const updatedFeedback = await this.feedbackRepository.updateOne(feedback, updateData)

    return response(updatedFeedback, false, HTTP_RESPONSE.FEEDBACK.UPDATE_FEEDBACK_SUCCESS)
  }

  async getListFeedback(params: GetListFeedbackDTO) {
    const result = await this.feedbackRepository.getListFeedback(params)

    return response(result, false, HTTP_RESPONSE.COMMON.GET_DATA_SUCCESS)
  }

  async getListFeedbackByUser(req: Request, params: GetListFeedbackDTO) {
    const userId = req.user.id

    const result = await this.feedbackRepository.getListFeedback(params, userId)

    return response(result, false, HTTP_RESPONSE.COMMON.GET_DATA_SUCCESS)
  }
}
