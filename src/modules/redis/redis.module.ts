import { Module } from '@nestjs/common'
import Redis from 'ioredis'
import env from 'src/config/env'
import { REDIS_CLIENT } from './redis.constant'

@Module({
  providers: [
    {
      provide: REDIS_CLIENT,
      useFactory: (): Redis => {
        const client = new Redis({
          host: env.REDIS_HOST,
          port: env.REDIS_PORT,
          username: env.REDIS_USER_NAME,
          password: env.REDIS_PASSWORD
        })

        client.on('connect', () => console.log('Redis connected successfully'))
        client.on('error', (err) => console.error('Redis connection error', err))

        return client
      }
    }
  ],
  exports: [REDIS_CLIENT]
})
export class RedisModule {}
