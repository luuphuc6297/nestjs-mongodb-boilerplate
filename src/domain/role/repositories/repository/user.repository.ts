import { Injectable } from '@nestjs/common'
import { DatabaseMongoUUIDRepositoryAbstract } from 'database/abstracts/mongodb/repositories/database.mongo.uuid.repository.abstract'
import { RoleEntity } from 'domain/role/repositories/entities/role.entity'
import { UserDoc, UserEntity } from 'domain/user/repositories/entities/user.entity'
import { DatabaseModel } from 'infrastructure/decorators'
import { Model } from 'mongoose'

@Injectable()
export class UserRepository extends DatabaseMongoUUIDRepositoryAbstract<UserEntity, UserDoc> {
    constructor(
        @DatabaseModel(UserEntity.name)
        private readonly userModel: Model<UserEntity>
    ) {
        super(userModel, {
            path: 'role',
            localField: 'role',
            foreignField: '_id',
            model: RoleEntity.name,
        })
    }
}
