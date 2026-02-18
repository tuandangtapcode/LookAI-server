import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { UserRoleEnum } from 'src/utils/enum/user'
import { Repository } from 'typeorm'
import { RegisterDTO } from '../auth/dto/register.dto'
import { BaseRepository } from '../common/base.repository'
import { PackageEntity } from '../package/package.entity'
import { UserSubscriptionEntity } from '../user-subscription/user-subscription.entity'
import { UserEntity } from './user.entity'

@Injectable()
export class UserRepository extends BaseRepository<UserEntity> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ) {
    super(userRepository)
  }

  async getDetailProfile(id: string) {
    const qb = this.userRepository.createQueryBuilder('u').where('u.id = :id', { id })
    const result = await qb.getOne()
    return result
  }

  async createUser(body: RegisterDTO, role: UserRoleEnum, defaultPackage: PackageEntity) {
    return await this.userRepository.manager.transaction(async (manager) => {
      const userRepo = manager.getRepository(UserEntity)
      const userSubscriptionRepo = manager.getRepository(UserSubscriptionEntity)
      let createdUser: UserEntity
      if (role === UserRoleEnum.USER) {
        const createUser = userRepo.create({ ...body, role })
        createdUser = await userRepo.save(createUser)
        const createUserSubscription = userSubscriptionRepo.create({
          userId: createdUser.id,
          packageId: defaultPackage.id,
          quota: defaultPackage.quota
        })
        await userSubscriptionRepo.save(createUserSubscription)
      } else {
        const createUser = userRepo.create({ ...body, role })
        createdUser = await userRepo.save(createUser)
      }
      return createdUser
    })
  }
}
