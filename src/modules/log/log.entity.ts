import { LogServiceEnum, LogTypeEnum } from 'src/utils/enum/log'
import { Column, Entity } from 'typeorm'
import BaseModel from '../common/base'

@Entity({ name: 'system_log', schema: 'public' })
export class LogEntity extends BaseModel {
  @Column({ name: 'type', type: 'int' })
  type: LogTypeEnum

  @Column({ name: 'title', type: 'text' })
  title: string

  @Column({ name: 'message', type: 'text' })
  message: string

  @Column({ name: 'detail', type: 'text' })
  detail: string

  @Column({ name: 'endpoint', type: 'text', nullable: true })
  endpoint?: string

  @Column({ name: 'body', type: 'text', nullable: true })
  body?: string

  @Column({ name: 'third_endpoint', type: 'text', nullable: true })
  thirdEndpoint?: string

  @Column({ name: 'third_body', type: 'text', nullable: true })
  thirdBody?: string

  @Column({ name: 'service', type: 'int' })
  service: LogServiceEnum
}
