import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { Request } from 'express'
import HTTP_RESPONSE from 'src/utils/const/http-response'
import { response } from 'src/utils/helper/common'
import { requestToAI } from '../common/ai-service'
import { UserSubscriptionRepository } from '../user-subscription/user-subscription.repository'
import { WardrobeEntity } from '../wardrobe/wardrobe.entity'
import { WardrobeRepository } from '../wardrobe/wardrobe.repository'
import { CreateOutfitAdviceDTO } from './dto/create-outfit-advice.dto'
import { FeedbackOutfitAdviceDTO } from './dto/feedback-outfit-advice.dto'
import { GetListOutfitAdviceDTO } from './dto/get-list-outfit-advice.dto'
import { OutfitAdviceRepository } from './outfit-advice.repository'

@Injectable()
export class OutfitAdviceService {
  constructor(
    private readonly outfitAdviceRepository: OutfitAdviceRepository,
    private readonly wardrobeRepository: WardrobeRepository,
    private readonly userSubscriptionRepository: UserSubscriptionRepository
  ) {}

  async createOutfitAdvice(req: Request, body: CreateOutfitAdviceDTO) {
    try {
      const userId = req.user.id
      let wardrobes: WardrobeEntity[] = []
      let outfitAdviceHistory: any = []
      const userSubscription = await this.userSubscriptionRepository.getSubscriptionByUserId(userId)
      if (!userSubscription) return response({}, true, HTTP_RESPONSE.USER.USER_SUBSCRIPTION_NOT_EXIST)
      if (userSubscription.usedQuota === userSubscription.quota)
        return response({}, true, HTTP_RESPONSE.OUTFIT_ADVICE.USED_UP_ALL_AVAILABLE_CONSULTATIONS)
      if (userSubscription.package.price) {
        wardrobes = await this.wardrobeRepository.findMany({ userId })
        outfitAdviceHistory = await this.outfitAdviceRepository.getListOutfitAdvice(
          { pageSize: 5, currentPage: 1, textSearch: '' },
          userId,
          false
        )
      }
      const { answer, requestPayload, inputToken, outputToken } = await requestToAI({
        body,
        packageName: userSubscription.package.name,
        wardrobes,
        outfitAdviceHistory
      })
      this.outfitAdviceRepository.createOutfitAdvice(
        {
          userId,
          package: userSubscription.package,
          requestPayload,
          responsePayload: answer,
          inputToken,
          outputToken
        },
        userSubscription.id
      )
      return response(
        {
          answer,
          payload: body
        },
        false,
        HTTP_RESPONSE.COMMON.GET_DATA_SUCCESS
      )
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  async feedbackOutfitAdvice(body: FeedbackOutfitAdviceDTO) {
    try {
      const { outfitAdviceId, feedback } = body
      const outfitAdvice = await this.outfitAdviceRepository.findOne({ id: outfitAdviceId })
      if (!outfitAdvice) return response({}, true, HTTP_RESPONSE.OUTFIT_ADVICE.OUTFIT_ADVICE_NOT_EXIST)
      await this.outfitAdviceRepository.updateOne(outfitAdvice, { feedback })
      return response({}, false, HTTP_RESPONSE.OUTFIT_ADVICE.FEEDBACK_OUTFIT_ADVICE_SUCCESS)
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  async getListOutfitAdviceByAdmin(params: GetListOutfitAdviceDTO) {
    try {
      const { userId } = params
      const result = await this.outfitAdviceRepository.getListOutfitAdvice(params, userId)
      return response(result, false, HTTP_RESPONSE.COMMON.GET_DATA_SUCCESS)
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }
}
