import { ExpenseTypeEnum } from 'src/utils/enum/expense'
import { Column, Entity } from 'typeorm'
import BaseModel from '../common/base'

@Entity({ name: 'expense', schema: 'public' })
export class ExpenseEntity extends BaseModel {
  @Column({ name: 'amount', type: 'int' })
  amount: number

  @Column({ name: 'type', type: 'varchar', length: 50 })
  type: ExpenseTypeEnum

  @Column({ name: 'description', type: 'text', nullable: true })
  description?: string

  @Column({ name: 'for_month', type: 'int' })
  forMonth: number

  @Column({ name: 'for_year', type: 'int' })
  forYear: number
}
