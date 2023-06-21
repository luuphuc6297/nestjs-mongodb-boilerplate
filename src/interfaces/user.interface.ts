import { RoleDoc, RoleEntity } from 'domain/role/repositories/entities/role.entity'
import { UserDoc, UserEntity } from 'domain/user/repositories/entities/user.entity'

export interface IUserEntity extends Omit<UserEntity, 'role'> {
    role: RoleEntity
}

export interface IUserDoc extends Omit<UserDoc, 'role'> {
    role: RoleDoc
}

export interface IUserGoogleEntity {
    accessToken: string
    refreshToken: string
}
