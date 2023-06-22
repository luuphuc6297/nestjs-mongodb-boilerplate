import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { DATABASE_CONNECTION_NAME } from 'constants/database/database.constant'
import { UserEntity, UserSchema } from 'domain/user/repositories/entities/user.entity'
import { UserRepository } from 'domain/user/repositories/repository/user.repository'

@Module({
    providers: [UserRepository],
    exports: [UserRepository],
    controllers: [],
    imports: [
        MongooseModule.forFeature(
            [
                {
                    name: UserEntity.name,
                    schema: UserSchema,
                },
            ],
            DATABASE_CONNECTION_NAME
        ),
    ],
})
export class UserRepositoryModule {}
