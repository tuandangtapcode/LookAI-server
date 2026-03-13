import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { Request } from 'express'
import HTTP_RESPONSE from 'src/utils/const/http-response'
import { response } from 'src/utils/helper/common'
import { PackageRepository } from '../package/package.repository'
import { UserRepository } from '../user/user.repository'
import { CreatePaymentDTO } from './dto/create-payment.dto'
import { GetListPaymentDTO } from './dto/get-list-payment.dto'
import { PaymentRepository } from './payment.repository'

@Injectable()
export class PaymentService {
  constructor(
    private readonly paymentRepository: PaymentRepository,
    private readonly packageRepository: PackageRepository,
    private readonly userRepository: UserRepository
  ) {}

  async createPayment(req: Request, body: CreatePaymentDTO) {
    try {
      const userId = req.user.id
      const { packageId } = body
      const packageDetail = await this.packageRepository.findOne({ id: packageId })
      if (!packageDetail) return response({}, true, HTTP_RESPONSE.PACKAGE.PACKAGE_NOT_EXIST)
      await this.paymentRepository.createPayment(body, userId, packageDetail)
      return response({}, false, HTTP_RESPONSE.PAYMENT.CREATE_PAYMENT_SUCCESS)
    } catch (error) {
      throw new InternalServerErrorException(error.message)
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
