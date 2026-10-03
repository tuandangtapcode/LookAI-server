import { IsEnum, IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator'
import { SubscriptionHistoryStatusEnum } from 'src/modules/subscription-history/subscription-history.enum'

export class CreatePaymentDTO {
  @IsNotEmpty()
  @IsUUID()
  packageId: string

  @IsNotEmpty()
  @IsNumber()
  amount: number

  @IsNotEmpty()
  @IsString()
  orderCode: string

  @IsNotEmpty()
  @IsEnum(SubscriptionHistoryStatusEnum)
  subscriptionHistoryStatus: SubscriptionHistoryStatusEnum
}
