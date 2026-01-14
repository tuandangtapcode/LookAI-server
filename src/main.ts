import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import express from 'express'
import { rateLimit } from 'express-rate-limit'
import helmet from 'helmet'
import { AppModule } from './app.module'
import env from './config/env'
import { ALLOW_ORIGINS } from './utils/const/common'

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule)

  app.enableCors({
    origin: ALLOW_ORIGINS,
    credentials: true
  })

  app.use(compression())

  app.use(helmet())

  app.use(cookieParser())

  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      limit: 1000,
      standardHeaders: 'draft-7',
      legacyHeaders: false
    })
  )

  app.use(express.json({ limit: '50mb' }))

  app.use(express.urlencoded({ limit: '50mb', extended: true }))

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true
    })
  )

  await app.listen(env.PORT ?? 9999)
}

bootstrap()
