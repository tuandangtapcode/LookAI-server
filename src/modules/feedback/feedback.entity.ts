import { FeedbackStatusEnum, FeedbackTypeEnum } from 'src/utils/enum/feedback'
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm'
import BaseModel from '../common/base'
import { UserEntity } from '../user/user.entity'

@Entity({ name: 'feedback', schema: 'public' })
export class FeedbackEntity extends BaseModel {
  @Column({ name: 'user_id', type: 'uuid' })
  userId: string

  @Column({ name: 'type', type: 'int' })
  type: FeedbackTypeEnum

  @Column({ name: 'content', type: 'text' })
  content: string

  @Column({ name: 'status', type: 'int', default: FeedbackStatusEnum.NEWLY_CREATED })
  status: FeedbackStatusEnum

  @OneToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity
}
