import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common'
import { Request, Response } from 'express'
import env from 'src/config/env'
import { LogRepository } from 'src/modules/log/log.repository'
import HTTP_RESPONSE from 'src/utils/const/http-response'
import { logError } from 'src/utils/helper/log'

/**
 * Bộ lọc lỗi tập trung: mọi exception văng ra từ controller/service đều đi qua đây.
 * - Log ra stdout (để hệ thống log hạ tầng như CloudWatch/Loki thu thập, không phụ thuộc DB ứng dụng).
 * - Chỉ persist vào bảng system_log các lỗi 5xx (lỗi thật sự ngoài dự đoán), tránh spam log
 *   với các lỗi nghiệp vụ bình thường (400/401/404...).
 * - Không leak message lỗi nội bộ (stack, driver error...) ra client ở production.
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name)

  constructor(private readonly logRepository: LogRepository) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()

    const isHttpException = exception instanceof HttpException
    const status: number = isHttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR
    const exceptionResponse = isHttpException ? exception.getResponse() : undefined
    const error = exception as any

    this.logger.error(`${request.method} ${request.originalUrl} -> ${status} : ${error?.message}`, error?.stack)

    if (status >= (HttpStatus.INTERNAL_SERVER_ERROR as number)) {
      this.logRepository.insertLogSafe(logError({ method: `${request.method} ${request.originalUrl}`, error }))
    }

    response.status(status).json({
      statusCode: status,
      message: this.resolveClientMessage(error, isHttpException, exceptionResponse),
      timestamp: new Date().toISOString(),
      path: request.originalUrl
    })
  }

  private resolveClientMessage(error: any, isHttpException: boolean, exceptionResponse: any): string {
    // Lỗi nghiệp vụ chủ động throw (NotFoundException, BadRequestException...) luôn an toàn để trả nguyên văn.
    if (isHttpException) {
      const message: string =
        typeof exceptionResponse === 'string' ? exceptionResponse : (exceptionResponse?.message ?? error?.message)
      return message
    }

    // Lỗi ngoài dự đoán (DB, third-party, bug...): không leak chi tiết ra ngoài production.
    if (env.NODE_ENV !== 'production') {
      const message: string = error?.message || HTTP_RESPONSE.COMMON.HAVE_AN_ERROR
      return message
    }

    return HTTP_RESPONSE.COMMON.HAVE_AN_ERROR
  }
}
