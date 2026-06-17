import { AsyncLocalStorage } from 'async_hooks'

export interface IRequestContext {
  endpoint?: string
  requestId?: string
  userId?: string
  body?: any
}

export const requestContext = new AsyncLocalStorage<IRequestContext>()
