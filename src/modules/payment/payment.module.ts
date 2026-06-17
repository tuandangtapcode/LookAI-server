import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PackageModule } from '../package/package.module'
import { SubscriptionHistoryModule } from '../subscription-history/subscription-history.module'
import { PaymentController } from './payment.controller'
import { PaymentEntity } from './payment.entity'
import { PaymentRepository } from './payment.repository'
import { PaymentService } from './payment.service'

@Module({
  imports: [TypeOrmModule.forFeature([PaymentEntity]), SubscriptionHistoryModule, PackageModule],
  controllers: [PaymentController],
  providers: [PaymentService, PaymentRepository],
  exports: [PaymentRepository]
})
export class PaymentModule {}
