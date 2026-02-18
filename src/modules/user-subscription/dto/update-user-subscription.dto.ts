import { IsNotEmpty, IsUUID } from 'class-validator'

export class UpdateUserSubscriptionDTO {
  @IsNotEmpty()
  @IsUUID()
  userSubscriptionId: string
}
