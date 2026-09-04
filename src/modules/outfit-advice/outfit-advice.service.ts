import { Injectable } from '@nestjs/common'
import { Request } from 'express'
import HTTP_RESPONSE from 'src/utils/const/http-response'
import { UserSubscriptionStatusEnum } from 'src/utils/enum/user-subscription'
import { response } from 'src/utils/helper/common'
import { DataSource } from 'typeorm'
import { AIService } from '../common/ai-service'
import { UserSubscriptionEntity } from '../user-subscription/user-subscription.entity'
import { UserSubscriptionRepository } from '../user-subscription/user-subscription.repository'
import { WardrobeEntity } from '../wardrobe/wardrobe.entity'
import { WardrobeRepository } from '../wardrobe/wardrobe.repository'
import { CreateOutfitAdviceDTO } from './dto/create-outfit-advice.dto'
import { FeedbackOutfitAdviceDTO } from './dto/feedback-outfit-advice.dto'
import { GetListOutfitAdviceDTO } from './dto/get-list-outfit-advice.dto'
import { OutfitAdviceEntity } from './outfit-advice.entity'
import { OutfitAdviceRepository } from './outfit-advice.repository'

@Injectable()
export class OutfitAdviceService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly outfitAdviceRepository: OutfitAdviceRepository,
    private readonly wardrobeRepository: WardrobeRepository,
    private readonly userSubscriptionRepository: UserSubscriptionRepository,
    private readonly aiService: AIService
  ) {}

  async createOutfitAdvice(req: Request, body: CreateOutfitAdviceDTO) {
    const queryRunner = this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()

    try {
      const userId = req.user.id
      let wardrobes: WardrobeEntity[] = []
      let outfitAdviceHistory: any = []

      const userSubscription = await this.userSubscriptionRepository.getSubscriptionByUserId(userId)
      if (!userSubscription) return response({}, true, HTTP_RESPONSE.USER.USER_SUBSCRIPTION_NOT_EXIST)
      if (userSubscription.usedQuota === userSubscription.quota)
        return response({}, true, HTTP_RESPONSE.USER_SUBSCRIPTION.USED_UP_ALL_AVAILABLE_CONSULTATIONS)
      if (userSubscription.status !== UserSubscriptionStatusEnum.ACTIVE)
        return response({}, true, HTTP_RESPONSE.USER_SUBSCRIPTION.SUBSCRIPTION_EXPIRED)

      if (userSubscription.package.price) {
        wardrobes = await this.wardrobeRepository.findMany({ userId })
        outfitAdviceHistory = await this.outfitAdviceRepository.getListOutfitAdvice(
          { pageSize: 5, currentPage: 1, textSearch: '' },
          userId,
          false
        )
      }

      const { answer, requestPayload, inputToken, outputToken } = await this.aiService.requestToAI({
        body,
        packageName: userSubscription.package.name,
        wardrobes,
        outfitAdviceHistory
      })

      const userSubscriptionRepo = queryRunner.manager.getRepository(UserSubscriptionEntity)
      const outfitAdviceRepo = queryRunner.manager.getRepository(OutfitAdviceEntity)

      const createOutfitAdvice = outfitAdviceRepo.create({
        userId,
        package: userSubscription.package,
        requestPayload,
        responsePayload: answer,
        inputToken,
        outputToken
      })
      await outfitAdviceRepo.save(createOutfitAdvice)

      await userSubscriptionRepo.update(userSubscription.id, {
        usedQuota: () => 'used_quota + 1'
      })

      await queryRunner.commitTransaction()

      return response(
        {
          answer,
          payload: body
        },
        false,
        HTTP_RESPONSE.COMMON.GET_DATA_SUCCESS
      )
    } catch (error) {
      await queryRunner.rollbackTransaction()
      throw error
    } finally {
      await queryRunner.release()
    }
  }

  async feedbackOutfitAdvice(req: Request, body: FeedbackOutfitAdviceDTO) {
    const { outfitAdviceId, feedback } = body
    const userId = req.user.id

    const outfitAdvice = await this.outfitAdviceRepository.findOne({ id: outfitAdviceId, userId })
    if (!outfitAdvice) return response({}, true, HTTP_RESPONSE.OUTFIT_ADVICE.OUTFIT_ADVICE_NOT_EXIST)

    await this.outfitAdviceRepository.updateOne(outfitAdvice, { feedback })

    return response({}, false, HTTP_RESPONSE.OUTFIT_ADVICE.FEEDBACK_OUTFIT_ADVICE_SUCCESS)
  }

  async getListOutfitAdviceByAdmin(params: GetListOutfitAdviceDTO) {
    const { userId } = params

    const result = await this.outfitAdviceRepository.getListOutfitAdvice(params, userId)

    return response(result, false, HTTP_RESPONSE.COMMON.GET_DATA_SUCCESS)
  }
}
