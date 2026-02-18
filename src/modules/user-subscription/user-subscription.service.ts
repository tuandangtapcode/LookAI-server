import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { Request } from 'express'
import HTTP_RESPONSE from 'src/utils/const/http-response'
import { UserSubscriptionStatusEnum } from 'src/utils/enum/user-subscription'
import { response } from 'src/utils/helper/common'
import { PackageRepository } from '../package/package.repository'
import { UserRepository } from '../user/user.repository'
import { UpdateUserSubscriptionDTO } from './dto/update-user-subscription.dto'
import { UserSubscriptionRepository } from './user-subscription.repository'

@Injectable()
export class UserSubscriptionService {
  constructor(
    private readonly userSubscriptionRepository: UserSubscriptionRepository,
    private readonly userRepository: UserRepository,
    private readonly packageRepository: PackageRepository
  ) {}

  async getSubscriptionByUser(req: Request) {
    try {
      const userId = req.user.id
      const user = await this.userRepository.findOne({ id: userId })
      if (!user) return response({}, true, HTTP_RESPONSE.USER.USER_NOT_EXIST)
      const result = await this.userSubscriptionRepository.getSubscriptionByUser(userId)
      return response(result, false, HTTP_RESPONSE.COMMON.GET_DATA_SUCCESS)
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  async updateSubscription(req: Request, body: UpdateUserSubscriptionDTO) {
    try {
      const userId = req.user.id
      const { userSubscriptionId } = body
      const userSubscription = await this.userSubscriptionRepository.findOne({ id: userSubscriptionId, userId })
      if (!userSubscription) return response({}, true, HTTP_RESPONSE.USER_SUBSCRIPTION.SUBSCRIPTION_NOT_EXIST)
      const defaultPackage = await this.packageRepository.findOne({ quota: 0 })
      if (!defaultPackage) return response({}, true, HTTP_RESPONSE.PACKAGE.PACKAGE_NOT_EXIST)
      const result = await this.userSubscriptionRepository.updateOne(userSubscription, {
        usedQuota: 0,
        quota: defaultPackage.quota,
        startDate: new Date(),
        endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
        status: UserSubscriptionStatusEnum.ACTIVE
      })
      return response(result, false, HTTP_RESPONSE.USER_SUBSCRIPTION.UPDATE_USER_SUBSCRIPTION_SUCCESS)
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }
}
