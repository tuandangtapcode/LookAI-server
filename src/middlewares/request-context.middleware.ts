import { Injectable, NestMiddleware } from '@nestjs/common'
import { NextFunction, Request, Response } from 'express'
import { requestContext } from 'src/utils/const/request-context'

@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    requestContext.run(
      {
        endpoint: `${req.method} ${req.originalUrl}`,
        body: req.body
      },
      () => next()
    )
  }
}
