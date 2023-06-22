import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { DATABASE_CONNECTION_NAME } from 'constants/database/database.constant'
import { RoleEntity, RoleSchema } from 'domain/role/repositories/entities/role.entity'
import { RoleRepository } from 'domain/role/repositories/repository/role.repository'

@Module({
    providers: [RoleRepository],
    exports: [RoleRepository],
    controllers: [],
    imports: [
        MongooseModule.forFeature(
            [
                {
                    name: RoleEntity.name,
                    schema: RoleSchema,
                },
            ],
            DATABASE_CONNECTION_NAME
        ),
    ],
})
export class RoleRepositoryModule {}
