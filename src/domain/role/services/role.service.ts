import { Injectable } from '@nestjs/common'
import {
    IDatabaseCreateManyOptions,
    IDatabaseCreateOptions,
    IDatabaseExistOptions,
    IDatabaseFindAllOptions,
    IDatabaseFindOneOptions,
    IDatabaseGetTotalOptions,
    IDatabaseManyOptions,
    IDatabaseSaveOptions,
    IRoleService,
} from 'interfaces'
import { RoleCreateDto } from '../dtos/role.create.dto'
import { RoleUpdatePermissionDto } from '../dtos/role.update-permission.dto'
import { RoleUpdateDto } from '../dtos/role.update.dto'
import { RoleDoc, RoleEntity } from '../repositories/entities/role.entity'
import { RoleRepository } from '../repositories/repository/role.repository'

@Injectable()
export class RoleService implements IRoleService {
    constructor(private readonly roleRepository: RoleRepository) {}

    async findAll(
        find?: Record<string, any>,
        options?: IDatabaseFindAllOptions
    ): Promise<RoleEntity[]> {
        return this.roleRepository.findAll<RoleEntity>(find, options)
    }

    async findOneById(_id: string, options?: IDatabaseFindOneOptions): Promise<RoleDoc> {
        return this.roleRepository.findOneById<RoleDoc>(_id, options)
    }

    async findOne(find: Record<string, any>, options?: IDatabaseFindOneOptions): Promise<RoleDoc> {
        return this.roleRepository.findOne<RoleDoc>(find, options)
    }

    async findOneByName(name: string, options?: IDatabaseFindOneOptions): Promise<RoleDoc> {
        return this.roleRepository.findOne<RoleDoc>({ name }, options)
    }

    async getTotal(
        find?: Record<string, any>,
        options?: IDatabaseGetTotalOptions
    ): Promise<number> {
        return this.roleRepository.getTotal(find, options)
    }

    async existByName(name: string, options?: IDatabaseExistOptions): Promise<boolean> {
        return this.roleRepository.exists(
            {
                name,
            },
            { ...options, withDeleted: true }
        )
    }

    async create(
        { name, description, type, permissions }: RoleCreateDto,
        options?: IDatabaseCreateOptions
    ): Promise<RoleDoc> {
        const create: RoleEntity = new RoleEntity()
        create.name = name
        create.description = description
        create.type = type
        create.permissions = permissions
        create.isActive = true

        return this.roleRepository.create<RoleEntity>(create, options)
    }

    async update(
        repository: RoleDoc,
        { description }: RoleUpdateDto,
        options?: IDatabaseSaveOptions
    ): Promise<RoleDoc> {
        repository.description = description

        return this.roleRepository.save(repository, options)
    }

    async updatePermissions(
        repository: RoleDoc,
        { permissions, type }: RoleUpdatePermissionDto,
        options?: IDatabaseSaveOptions
    ): Promise<RoleDoc> {
        repository.permissions = permissions
        repository.type = type

        return this.roleRepository.save(repository, options)
    }

    async active(repository: RoleDoc, options?: IDatabaseSaveOptions): Promise<RoleDoc> {
        repository.isActive = true

        return this.roleRepository.save(repository, options)
    }

    async inactive(repository: RoleDoc, options?: IDatabaseSaveOptions): Promise<RoleDoc> {
        repository.isActive = false

        return this.roleRepository.save(repository, options)
    }

    async delete(repository: RoleDoc, options?: IDatabaseSaveOptions): Promise<RoleDoc> {
        return this.roleRepository.softDelete(repository, options)
    }

    async deleteMany(find: Record<string, any>, options?: IDatabaseManyOptions): Promise<boolean> {
        return this.roleRepository.deleteMany(find, options)
    }

    async createMany(
        data: RoleCreateDto[],
        options?: IDatabaseCreateManyOptions
    ): Promise<boolean> {
        const create: RoleEntity[] = data.map(({ type, name, permissions }) => {
            const entity: RoleEntity = new RoleEntity()
            entity.type = type
            entity.isActive = true
            entity.name = name
            entity.permissions = permissions

            return entity
        })
        return this.roleRepository.createMany<RoleEntity>(create, options)
    }
}
