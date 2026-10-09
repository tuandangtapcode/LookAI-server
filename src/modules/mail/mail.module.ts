import { BullModule } from '@nestjs/bullmq'
import { Module } from '@nestjs/common'
import { QUEUE_NAME } from 'src/common/const/common'
import { MailProcessor } from './mail.processor'
import { MailService } from './mail.service'

@Module({
  imports: [
    BullModule.registerQueue({
      name: QUEUE_NAME.MAIL,
      defaultJobOptions: {
        attempts: 3,
        backoff: { type: 'exponential', delay: 2000 },
        removeOnComplete: { age: 24 * 3600 },
        removeOnFail: { age: 7 * 24 * 3600 }
      }
    })
  ],
  providers: [MailService, MailProcessor],
  exports: [MailService]
})
export class MailModule {}
