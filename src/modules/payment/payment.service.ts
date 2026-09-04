import { Injectable } from '@nestjs/common'
import { Request } from 'express'
import HTTP_RESPONSE from 'src/utils/const/http-response'
import { response } from 'src/utils/helper/common'
import { DataSource } from 'typeorm'
import { PackageRepository } from '../package/package.repository'
import { SubscriptionHistoryEntity } from '../subscription-history/subscription-history.entity'
import { UserSubscriptionEntity } from '../user-subscription/user-subscription.entity'
import { CreatePaymentDTO } from './dto/create-payment.dto'
import { GetListPaymentDTO } from './dto/get-list-payment.dto'
import { PaymentEntity } from './payment.entity'
import { PaymentRepository } from './payment.repository'

@Injectable()
export class PaymentService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly paymentRepository: PaymentRepository,
    private readonly packageRepository: PackageRepository
  ) {}

  async createPayment(req: Request, body: CreatePaymentDTO) {
    const queryRunner = this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()

    try {
      const userId = req.user.id
      const { amount, packageId, subscriptionHistoryStatus, orderCode } = body

      const packageDetail = await this.packageRepository.findOne({ id: packageId })
      if (!packageDetail) return response({}, true, HTTP_RESPONSE.PACKAGE.PACKAGE_NOT_EXIST)

      const paymentRepo = queryRunner.manager.getRepository(PaymentEntity)
      const subscriptionHistoryRepo = queryRunner.manager.getRepository(SubscriptionHistoryEntity)
      const userSubscriptionRepo = queryRunner.manager.getRepository(UserSubscriptionEntity)

      const createSubscriptionHistory = subscriptionHistoryRepo.create({
        userId,
        packageId,
        packageSnapshot: JSON.stringify(packageDetail),
        status: subscriptionHistoryStatus
      })
      const createdSubscriptionHistory = await subscriptionHistoryRepo.save(createSubscriptionHistory)

      const createPayment = paymentRepo.create({
        userId,
        packageId,
        subscriptionHistoryId: createdSubscriptionHistory.id,
        amount,
        orderCode
      })
      await paymentRepo.save(createPayment)

      const startDate = new Date()
      const endDate = new Date()
      const packageDuration = packageDetail.duration ?? 0
      endDate.setDate(endDate.getDate() + packageDuration)

      await userSubscriptionRepo.update(
        { userId },
        {
          packageId: packageDetail.id,
          quota: packageDetail.quota,
          usedQuota: 0,
          startDate,
          endDate
        }
      )

      await queryRunner.commitTransaction()

      return response({}, false, HTTP_RESPONSE.PAYMENT.CREATE_PAYMENT_SUCCESS)
    } catch (error) {
      await queryRunner.rollbackTransaction()
      throw error
    } finally {
      await queryRunner.release()
    }
  }

  async getListPayment(params: GetListPaymentDTO) {
    const result = await this.paymentRepository.getListPayment(params)

    return response(result, false, HTTP_RESPONSE.COMMON.GET_DATA_SUCCESS)
  }

  async getListPaymentByUser(req: Request, params: GetListPaymentDTO) {
    const userId = req.user.id

    const result = await this.paymentRepository.getListPayment(params, userId)

    return response(result, false, HTTP_RESPONSE.COMMON.GET_DATA_SUCCESS)
  }
}
