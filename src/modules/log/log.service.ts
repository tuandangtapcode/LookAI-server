import { Injectable, InternalServerErrorException } from '@nestjs/common'
import HTTP_RESPONSE from 'src/utils/const/http-response'
import { response } from 'src/utils/helper/common'
import { CreateLogDTO } from './dto/create-log.dto'
import { GetListLogDTO } from './dto/get-list-log.dto'
import { LogRepository } from './log.repository'

@Injectable()
export class LogService {
  constructor(private readonly logRepository: LogRepository) {}

  async createLog(body: CreateLogDTO) {
    try {
      await this.logRepository.insertOne(body)

      return response({}, false, HTTP_RESPONSE.LOG.CREATE_LOG_SUCCESS)
    } catch (error: any) {
      throw new InternalServerErrorException(error.message)
    }
  }

  async getListLog(params: GetListLogDTO) {
    try {
      const result = await this.logRepository.getListLog(params)

      return response(result, false, HTTP_RESPONSE.COMMON.GET_DATA_SUCCESS)
    } catch (error: any) {
      throw new InternalServerErrorException(error.message)
    }
  }
}
