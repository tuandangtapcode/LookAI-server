import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PackageModule } from '../package/package.module'
import { UserModule } from '../user/user.module'
import { UserSubscriptionController } from './user-subscription.controller'
import { UserSubscriptionEntity } from './user-subscription.entity'
import { UserSubscriptionRepository } from './user-subscription.repository'
import { UserSubscriptionService } from './user-subscription.service'

@Module({
  imports: [TypeOrmModule.forFeature([UserSubscriptionEntity]), UserModule, PackageModule],
  controllers: [UserSubscriptionController],
  providers: [UserSubscriptionService, UserSubscriptionRepository],
  exports: [UserSubscriptionRepository]
})
export class UserSubscriptionModule {}
