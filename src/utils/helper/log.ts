import moment from 'moment'
import { requestContext } from '../const/request-context'
import { LogServiceEnum, LogTypeEnum } from '../enum/log'
import { ITokenData } from 'src/modules/auth/auth.interface'
import { scrubSensitiveData } from './sensitive-data'

export const logCronJob = (method: string, message: string) => {
  const time = moment().format('DD/MM/YYYY HH:mm:ss')

  return {
    service: LogServiceEnum.SERVER,
    type: LogTypeEnum.CRON_JOB,
    title: method,
    message: message,
    detail: `${message} at ${time}`,
    createdAt: new Date()
  }
}

export const logError = (options: { method: string; error: any; thirdEndpoint?: string; thirdBody?: string }) => {
  const { method, error, thirdEndpoint, thirdBody } = options
  const ctx = requestContext.getStore()

  return {
    service: LogServiceEnum.SERVER,
    type: LogTypeEnum.ERROR,
    title: method,
    message: error?.message || 'Unknown error',
    detail: error?.stack || JSON.stringify(error),
    createdAt: new Date(),
    endpoint: ctx?.endpoint,
    body: ctx?.body ? JSON.stringify(scrubSensitiveData(ctx.body)) : undefined,
    thirdEndpoint,
    thirdBody
  }
}

export const logDelete = (entity: string, user: ITokenData, record: any) => {
  const time = moment().format('DD/MM/YYYY HH:mm:ss')

  return {
    service: LogServiceEnum.SERVER,
    type: LogTypeEnum.DELETE,
    title: `${entity} deleted`,
    message: `user-${user.id} deleted ${entity}-${record.id} at ${time}`,
    detail: `User: ${JSON.stringify(user)}, Item: ${JSON.stringify(record)}`,
    createdAt: new Date()
  }
}
