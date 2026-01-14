import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { BaseRepository } from '../common/base.repository'
import { UserEntity } from './user.entity'
import { IUser } from './user.interface'

@Injectable()
export class UserRepository extends BaseRepository<UserEntity> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ) {
    super(userRepository)
  }

  async getDetailProfile(id: string) {
    const queryBuilder = this.userRepository
      .createQueryBuilder('u')
      .select([
        'u.id  "id"',
        'u.email "email"',
        'u.avatar "avatar"',
        'u.user_name "userName"',
        'u.phone "phone"',
        'u.date_of_birth "dateOfBirth"',
        'u.gender "gender"',
        'u.role "role"',
        'u.status "status"'
      ])
      .where('u.id = :id', { id })
    const result = await queryBuilder.getRawOne<IUser>()
    return result
  }
}
