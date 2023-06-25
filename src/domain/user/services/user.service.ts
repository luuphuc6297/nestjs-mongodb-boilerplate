import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import {
    IAuthPassword,
    IDatabaseCreateOptions,
    IDatabaseFindAllOptions,
    IDatabaseFindOneOptions,
    IDatabaseSaveOptions,
    IUserEntity,
} from 'interfaces'
import { HelperDateService } from 'modules/helper/services/helper.date.service'
import { HelperStringService } from 'modules/helper/services/helper.string.service'
import { UserCreateDto } from '../dtos'
import { UserDoc, UserEntity } from '../repositories/entities/user.entity'
import { UserRepository } from '../repositories/repository/user.repository'

@Injectable()
export class UserService {
    private readonly uploadPath: string
    private readonly authMaxPasswordAttempt: number
    constructor(
        private readonly userRepository: UserRepository,
        private readonly helperDateService: HelperDateService,
        private readonly helperStringService: HelperStringService,
        private readonly configService: ConfigService
    ) {
        this.uploadPath = this.configService.get<string>('user.uploadPath')
        this.authMaxPasswordAttempt = this.configService.get<number>('auth.password.maxAttempt')
    }

    async findAll(
        find?: Record<string, any>,
        options?: IDatabaseFindAllOptions
    ): Promise<IUserEntity[]> {
        return this.userRepository.findAll<IUserEntity>(find, {
            ...options,
            join: true,
        })
    }

    async findOneById<T>(_id: string, options?: IDatabaseFindOneOptions): Promise<T> {
        return this.userRepository.findOneById<T>(_id, options)
    }

    async findOne<T>(find: Record<string, any>, options?: IDatabaseFindOneOptions): Promise<T> {
        return this.userRepository.findOne<T>(find, options)
    }

    async findOneByUsername<T>(username: string, options?: IDatabaseFindOneOptions): Promise<T> {
        return this.userRepository.findOne<T>({ username }, options)
    }

    async findOneByEmail<T>(email: string, options?: IDatabaseFindOneOptions): Promise<T> {
        return this.userRepository.findOne<T>({ email }, options)
    }

    async findOneByMobileNumber<T>(
        mobileNumber: string,
        options?: IDatabaseFindOneOptions
    ): Promise<T> {
        return this.userRepository.findOne<T>({ mobileNumber }, options)
    }

    async create(
        { firstName, lastName, email, mobileNumber, role, signUpFrom }: UserCreateDto,
        { passwordExpired, passwordHash, salt, passwordCreated }: IAuthPassword,
        options?: IDatabaseCreateOptions
    ): Promise<UserDoc> {
        const create: UserEntity = new UserEntity()
        create.firstName = firstName
        create.email = email
        create.password = passwordHash
        create.role = role
        create.isActive = true
        create.inactivePermanent = false
        create.blocked = false
        create.lastName = lastName
        create.salt = salt
        create.passwordExpired = passwordExpired
        create.passwordCreated = passwordCreated
        create.signUpDate = this.helperDateService.create()
        create.passwordAttempt = 0
        create.mobileNumber = mobileNumber ?? undefined
        create.signUpFrom = signUpFrom

        return this.userRepository.create<UserEntity>(create, options)
    }

    async inactivePermanent(repository: UserDoc, options?: IDatabaseSaveOptions): Promise<UserDoc> {
        repository.isActive = false
        repository.inactivePermanent = true
        repository.inactiveDate = this.helperDateService.create()

        return this.userRepository.save(repository, options)
    }
}
