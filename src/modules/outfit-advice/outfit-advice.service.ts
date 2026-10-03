import { Injectable } from '@nestjs/common'
import { Request } from 'express'
import HTTP_RESPONSE from 'src/common/const/http-response'
import { response } from 'src/common/helper/common'
import { INVALID_REFINE_FEEDBACK } from 'src/modules/ai/ai.constant'
import { AIService } from 'src/modules/ai/ai.service'
import { DataSource } from 'typeorm'
import { UserSubscriptionEntity } from '../user-subscription/user-subscription.entity'
import { UserSubscriptionStatusEnum } from '../user-subscription/user-subscription.enum'
import { UserSubscriptionRepository } from '../user-subscription/user-subscription.repository'
import { WardrobeEntity } from '../wardrobe/wardrobe.entity'
import { WardrobeRepository } from '../wardrobe/wardrobe.repository'
import { CreateOutfitAdviceDTO } from './dto/create-outfit-advice.dto'
import { GetListOutfitAdviceDTO } from './dto/get-list-outfit-advice.dto'
import { RefineOutfitAdviceDTO } from './dto/refine-outfit-advice.dto'
import { OutfitAdviceEntity } from './outfit-advice.entity'
import { OutfitAdviceRatingEnum } from './outfit-advice.enum'
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
    const userId = req.user.id
    let wardrobes: WardrobeEntity[] = []
    let outfitAdviceHistory: any = []

    const userSubscription = await this.userSubscriptionRepository.getSubscriptionByUserId(userId)
    if (!userSubscription) return response({}, true, HTTP_RESPONSE.USER.USER_SUBSCRIPTION_NOT_EXIST)
    if (userSubscription.usedQuota >= userSubscription.quota)
      return response({}, true, HTTP_RESPONSE.USER_SUBSCRIPTION.USED_UP_ALL_AVAILABLE_CONSULTATIONS)
    if (userSubscription.status !== UserSubscriptionStatusEnum.ACTIVE)
      return response({}, true, HTTP_RESPONSE.USER_SUBSCRIPTION.SUBSCRIPTION_EXPIRED)

    if (userSubscription.package.price) {
      wardrobes = await this.wardrobeRepository.findMany({ userId }, { itemType: true })
      outfitAdviceHistory = await this.outfitAdviceRepository.getListOutfitAdvice(
        { pageSize: 3, currentPage: 1, textSearch: '' },
        userId,
        false
      )
    }

    const { answer, requestPayload, inputToken, outputToken } = await this.aiService.requestOutfitAdvice({
      body,
      packageName: userSubscription.package.name,
      wardrobes,
      outfitAdviceHistory
    })

    const queryRunner = this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()

    try {
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
      const newOutfitAdvice = await outfitAdviceRepo.save(createOutfitAdvice)

      await userSubscriptionRepo.update(userSubscription.id, {
        usedQuota: () => 'used_quota + 1'
      })

      await queryRunner.commitTransaction()

      return response(newOutfitAdvice, false, HTTP_RESPONSE.COMMON.GET_DATA_SUCCESS)
    } catch (error) {
      await queryRunner.rollbackTransaction()
      throw error
    } finally {
      await queryRunner.release()
    }
  }

  async refineOutfitAdvice(req: Request, body: RefineOutfitAdviceDTO) {
    const { outfitAdviceId, rating } = body
    const feedback = body.feedback?.trim() || undefined
    const userId = req.user.id

    if (!feedback && rating >= OutfitAdviceRatingEnum.GOOD)
      return response({}, true, HTTP_RESPONSE.OUTFIT_ADVICE.REFINE_FEEDBACK_REQUIRED)

    const targetOutfitAdvice = await this.outfitAdviceRepository.findOne({ id: outfitAdviceId, userId })
    if (!targetOutfitAdvice) return response({}, true, HTTP_RESPONSE.OUTFIT_ADVICE.OUTFIT_ADVICE_NOT_EXIST)

    const userSubscription = await this.userSubscriptionRepository.getSubscriptionByUserId(userId)
    if (!userSubscription) return response({}, true, HTTP_RESPONSE.USER.USER_SUBSCRIPTION_NOT_EXIST)
    if (userSubscription.status !== UserSubscriptionStatusEnum.ACTIVE)
      return response({}, true, HTTP_RESPONSE.USER_SUBSCRIPTION.SUBSCRIPTION_EXPIRED)

    const rootAdviceId = targetOutfitAdvice.parentAdviceId || targetOutfitAdvice.id
    const existingRefinements = await this.outfitAdviceRepository.findMany({ parentAdviceId: rootAdviceId })
    if (existingRefinements.length >= userSubscription.package.refine)
      return response({}, true, HTTP_RESPONSE.OUTFIT_ADVICE.REFINE_LIMIT_REACHED)

    const rootAdvice = targetOutfitAdvice.parentAdviceId
      ? await this.outfitAdviceRepository.findOne({ id: rootAdviceId, userId })
      : targetOutfitAdvice
    const payload: unknown = rootAdvice!.requestPayload
    const originalRequest = (typeof payload === 'string' ? JSON.parse(payload) : payload) as
      | CreateOutfitAdviceDTO
      | undefined
    const wardrobes = userSubscription.package.price
      ? await this.wardrobeRepository.findMany({ userId }, { itemType: true })
      : undefined

    const { answer, inputToken, outputToken } = await this.aiService.refineOutfitAdvice({
      previousAnswer: targetOutfitAdvice.responsePayload,
      feedback,
      originalRequest,
      packageName: userSubscription.package.name,
      wardrobes
    })

    if (answer.includes(INVALID_REFINE_FEEDBACK))
      return response({}, true, HTTP_RESPONSE.OUTFIT_ADVICE.INVALID_REFINE_FEEDBACK)

    const newOutfitAdvice = await this.outfitAdviceRepository.insertOne({
      userId,
      package: userSubscription.package,
      requestPayload: JSON.stringify({ type: 'refinement', baseAdviceId: outfitAdviceId, rating, feedback }),
      responsePayload: answer,
      inputToken,
      outputToken,
      parentAdviceId: rootAdviceId
    })

    return response(newOutfitAdvice, false, HTTP_RESPONSE.OUTFIT_ADVICE.REFINE_OUTFIT_ADVICE_SUCCESS)
  }

  async getListOutfitAdvice(params: GetListOutfitAdviceDTO) {
    const { userId } = params

    const result = await this.outfitAdviceRepository.getListOutfitAdvice(params, userId)

    return response(result, false, HTTP_RESPONSE.COMMON.GET_DATA_SUCCESS)
  }

  async getDetailOutfitAdvice(req: Request) {
    const userId = req.user.id
    const outfitAdviceId = req.params.outfitAdviceId as string

    const result = await this.outfitAdviceRepository.getDetailOutfitAdvice(outfitAdviceId, userId)
    if (!result.length) return response({}, true, HTTP_RESPONSE.OUTFIT_ADVICE.OUTFIT_ADVICE_NOT_EXIST)

    return response(result, false, HTTP_RESPONSE.COMMON.GET_DATA_SUCCESS)
  }

  async getListOutfitAdviceByUser(req: Request) {
    const userId = req.user.id

    const result = await this.outfitAdviceRepository.getListOutfitAdviceByUser(userId)

    return response(result, false, HTTP_RESPONSE.COMMON.GET_DATA_SUCCESS)
  }
}
