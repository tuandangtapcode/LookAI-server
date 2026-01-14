import { DeepPartial, FindOptionsWhere, ObjectLiteral, Repository, SelectQueryBuilder } from 'typeorm'

export class BaseRepository<T extends ObjectLiteral> {
  constructor(protected repository: Repository<T>) {}

  async insertOne(data: DeepPartial<T>) {
    const createEntity = this.repository.create(data)
    return await this.repository.save(createEntity)
  }

  async findOne(where: FindOptionsWhere<T>) {
    return await this.repository.findOne({ where })
  }

  async insertMany(data: DeepPartial<T>[]) {
    const createEntities = data.map((i) => this.repository.create(i))
    return await this.repository.save(createEntities)
  }

  async updateOne(oldData: T, newData: DeepPartial<T>) {
    const updateEntity = this.repository.merge(oldData, newData)
    return await this.repository.save(updateEntity)
  }

  async deleteOne(id: string, softDelete: boolean = true) {
    if (softDelete) {
      await this.repository.softDelete(id)
    } else {
      await this.repository.delete(id)
    }
  }

  async deleteMany(ids: string[], softDelete: boolean = true) {
    await Promise.all(ids.map((i) => (softDelete ? this.repository.softDelete(i) : this.repository.delete(i))))
  }

  async findMany(where: FindOptionsWhere<T>) {
    const result = await this.repository.find(where)
    return result
  }

  async getListWithPagination<P>(queryBuilder: SelectQueryBuilder<T>, pageSize: number, currentPage: number) {
    const [list, total] = await Promise.all([
      queryBuilder
        .limit(pageSize)
        .skip((currentPage - 1) * pageSize)
        .getRawMany<P>(),
      queryBuilder.getCount()
    ])
    return { list, total }
  }
}
