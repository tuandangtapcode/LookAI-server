import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { FeedbackController } from './feedback.controller'
import { FeedbackEntity } from './feedback.entity'
import { FeedbackRepository } from './feedback.repository'
import { FeedbackService } from './feedback.service'

@Module({
  imports: [TypeOrmModule.forFeature([FeedbackEntity])],
  controllers: [FeedbackController],
  providers: [FeedbackService, FeedbackRepository]
})
export class FeedbackModule {}
