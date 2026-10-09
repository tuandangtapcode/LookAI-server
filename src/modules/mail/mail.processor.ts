import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq'
import { Job, UnrecoverableError } from 'bullmq'
import ejs from 'ejs'
import nodemailer from 'nodemailer'
import path from 'path'
import { QUEUE_NAME } from 'src/common/const/common'
import env from 'src/config/env'
import { ISendMailJob } from './mail.interface'

const { MAIL_TRANSPORT_HOST, MAIL_AUTH_USERNAME, MAIL_AUTH_PASSWORD } = env

const transporter = nodemailer.createTransport({
  host: MAIL_TRANSPORT_HOST,
  port: 465,
  secure: true,
  auth: {
    user: MAIL_AUTH_USERNAME,
    pass: MAIL_AUTH_PASSWORD
  }
})

@Processor(QUEUE_NAME.MAIL, {
  concurrency: 5,
  limiter: {
    max: 10,
    duration: 1000
  }
})
export class MailProcessor extends WorkerHost {
  async process(job: Job<ISendMailJob>) {
    await this.sendEmail(job.data)
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job<ISendMailJob>) {
    console.log(`Mail job ${job.id}-${job.name} success (lần ${job.attemptsMade}/${job.opts.attempts})`)
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job<ISendMailJob>, error: Error) {
    console.error(
      `Mail job ${job.id}-${job.name} failed (lần ${job.attemptsMade}/${job.opts.attempts}):`,
      error.message
    )
  }

  private async sendEmail({ to, subject, data, template, attachments }: ISendMailJob) {
    const templatePath = path.join(process.cwd(), 'src/modules/mail/templates', `${template}.ejs`)
    const html = await ejs.renderFile(templatePath, data, { async: true })

    const mailOptions = {
      from: MAIL_AUTH_USERNAME,
      to,
      subject,
      html,
      attachments
    }
    try {
      await transporter.sendMail(mailOptions)
    } catch (error: any) {
      // SMTP 5xx = lỗi vĩnh viễn (vd: hết quota Gmail), retry vô ích
      if (error?.responseCode >= 500) throw new UnrecoverableError(error.message)
      throw error
    }
  }
}
