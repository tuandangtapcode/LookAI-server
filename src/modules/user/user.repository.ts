import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { UserRoleEnum } from 'src/utils/enum/user'
import { Repository } from 'typeorm'
import { BaseRepository } from '../common/base.repository'
import { GetListUserDTO } from './dto/get-list-user.dto'
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

  async getUserById(id: string) {
    const qb = this.userRepository
      .createQueryBuilder('u')
      .select([
        'u.id as id',
        'u.avatar as avatar',
        'u.user_name as userName',
        'u.email as email',
        'u.phone as phone',
        'u.skin_color as skinColor',
        'u.date_of_birth as dateOfBirth',
        'u.gender as gender',
        'u.height as height',
        'u.weight as weight',
        'u.bust as bust',
        'u.waist as waist',
        'u.hip as hip',
        'u.clothing_size as clothingSize',
        'u.current_style as currentStyle',
        'u.desired_style as desiredStyle',
        'u.occupation as occupation',
        'u.place as place',
        'u.role as role',
        'u.created_at as createdAt',
        'u.status as status'
      ])
      .where('u.id = :id', { id })

    const result = await qb.getRawOne<IUser>()

    return result
  }

  async getListUser(options: GetListUserDTO) {
    const { pageSize, currentPage, textSearch, gender, yearOfBirth } = options

    const qb = this.userRepository
      .createQueryBuilder('u')
      .select([
        'u.id as id',
        'u.user_name as userName',
        'u.email as email',
        'u.phone as phone',
        'u.date_of_birth as dateOfBirth',
        'u.gender as gender',
        'us.status as subscriptionStatus',
        'p.name as packageName',
        'COALESCE(SUM(oa.input_token), 0) as totalInputToken',
        'COALESCE(SUM(oa.output_token), 0) as totalOutputToken'
      ])
      .innerJoin('user_subscription', 'us', 'us.user_id = u.id')
      .innerJoin('package', 'p', 'p.id = us.package_id')
      .leftJoin('outfit_advice', 'oa', 'oa.user_id = u.id')
      .where('u.role = :role', { role: UserRoleEnum.USER })
      .groupBy('u.id')
      .orderBy('totalInputToken', 'DESC')
      .addOrderBy('totalOutputToken', 'DESC')

    if (textSearch) {
      qb.andWhere('u.user_name LIKE :textSearch', { textSearch: `%${textSearch}%` })
    }
    if (yearOfBirth) {
      qb.andWhere('YEAR(u.date_of_birth) = :yearOfBirth', { yearOfBirth })
    }
    if (gender) {
      qb.andWhere('u.gender = :gender', { gender })
    }

    const result = await this.getListWithPagination<IUser>(qb, pageSize, currentPage)

    return result
  }
}
