import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import BaseModel from '../common/base'
import { PackageEntity } from '../package/package.entity'
import { UserEntity } from '../user/user.entity'

@Entity({ name: 'outfit_advice', schema: 'public' })
export class OutfitAdviceEntity extends BaseModel {
  @Column({ name: 'user_id', type: 'uuid' })
  userId: string

  @Column({ name: 'package_id', type: 'uuid' })
  packageId: string

  @Column({ name: 'request_payload', type: 'json' })
  requestPayload: string

  @Column({ name: 'response_payload', type: 'json' })
  responsePayload: string

  @Column({ name: 'input_token', type: 'bigint' })
  inputToken: number

  @Column({ name: 'output_token', type: 'bigint' })
  outputToken: number

  @Column({ name: 'feedback', type: 'text', nullable: true })
  feedback: string

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity

  @ManyToOne(() => PackageEntity)
  @JoinColumn({ name: 'package_id' })
  package: PackageEntity
}
