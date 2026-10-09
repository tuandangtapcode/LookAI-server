import { InjectQueue } from '@nestjs/bullmq'
import { Injectable } from '@nestjs/common'
import { Queue } from 'bullmq'
import { MAIL_JOB, QUEUE_NAME, TEMPLATE_MAIL } from 'src/common/const/common'
import env from 'src/config/env'
import { ISendMailJob } from './mail.interface'

@Injectable()
export class MailService {
  constructor(@InjectQueue(QUEUE_NAME.MAIL) private readonly mailQueue: Queue<ISendMailJob>) {}

  private async addSendMailJob(jobData: ISendMailJob) {
    try {
      await this.mailQueue.add(MAIL_JOB.SEND_MAIL, jobData)
    } catch (error) {
      console.error('Add mail job failed:', error)
    }
  }

  sendMailRegisterSuccess(to: string, fullName: string) {
    return this.addSendMailJob({
      to,
      subject: 'Chào mừng bạn đến với MặcGì',
      template: TEMPLATE_MAIL.REGISTER_SUCCESS,
      data: { fullName, outfitAdviceUrl: env.CLIENT_URL }
    })
  }
}
