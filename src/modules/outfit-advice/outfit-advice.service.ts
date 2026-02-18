import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { Request } from 'express'
import HTTP_RESPONSE from 'src/utils/const/http-response'
import { response } from 'src/utils/helper/common'
import { requestToAI } from '../common/ai-service'
import { UserSubscriptionRepository } from '../user-subscription/user-subscription.repository'
import { WardrobeEntity } from '../wardrobe/wardrobe.entity'
import { WardrobeRepository } from '../wardrobe/wardrobe.repository'
import { CreateOutfitAdviceDTO } from './dto/create-outfit-advice.dto'
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
      const userSubscription = await this.userSubscriptionRepository.getSubscriptionByUser(userId)
      if (!userSubscription) return response({}, true, HTTP_RESPONSE.USER.USER_SUBSCRIPTION_NOT_EXIST)
      if (userSubscription.usedQuota === userSubscription.quota)
        return response({}, true, HTTP_RESPONSE.OUTFIT_ADVICE.USED_UP_ALL_AVAILABLE_CONSULTATIONS)
      if (['Premium', 'Basic'].includes(userSubscription.package.name)) {
        wardrobes = await this.wardrobeRepository.findMany({ userId })
      }
      const { answer, requestPayload, inputToken, outputToken } = await requestToAI({
        body,
        packageName: userSubscription.package.name,
        wardrobes
      })
      this.outfitAdviceRepository.createOutfitAdvice(
        {
          userId,
          packageId: userSubscription.package.id,
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
}
