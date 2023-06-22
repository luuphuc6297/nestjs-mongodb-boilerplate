import { Injectable } from '@nestjs/common'
import { DatabaseMongoUUIDRepositoryAbstract } from 'database/abstracts/mongodb/repositories/database.mongo.uuid.repository.abstract'
import { RoleDoc, RoleEntity } from 'domain/role/repositories/entities/role.entity'
import { DatabaseModel } from 'infrastructure/decorators'
import { Model } from 'mongoose'

@Injectable()
export class RoleRepository extends DatabaseMongoUUIDRepositoryAbstract<RoleEntity, RoleDoc> {
    constructor(
        @DatabaseModel(RoleEntity.name)
        private readonly roleModel: Model<RoleEntity>
    ) {
        super(roleModel)
    }
}
