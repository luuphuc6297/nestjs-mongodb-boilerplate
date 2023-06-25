import { RoleCreateDto } from 'domain/role/dtos/role.create.dto'
import { RoleUpdatePermissionDto } from 'domain/role/dtos/role.update-permission.dto'
import { RoleUpdateDto } from 'domain/role/dtos/role.update.dto'
import { RoleDoc, RoleEntity } from 'domain/role/repositories/entities/role.entity'
import {
    IDatabaseCreateManyOptions,
    IDatabaseCreateOptions,
    IDatabaseExistOptions,
    IDatabaseFindAllOptions,
    IDatabaseFindOneOptions,
    IDatabaseGetTotalOptions,
    IDatabaseManyOptions,
    IDatabaseSaveOptions,
} from './database.interface'

export interface IRoleService {
    findAll(find?: Record<string, any>, options?: IDatabaseFindAllOptions): Promise<RoleEntity[]>
    findOneById(_id: string, options?: IDatabaseFindOneOptions): Promise<RoleDoc>
    findOne(find: Record<string, any>, options?: IDatabaseFindOneOptions): Promise<RoleDoc>
    findOneByName(name: string, options?: IDatabaseFindOneOptions): Promise<RoleDoc>
    getTotal(find?: Record<string, any>, options?: IDatabaseGetTotalOptions): Promise<number>
    existByName(name: string, options?: IDatabaseExistOptions): Promise<boolean>
    create(data: RoleCreateDto, options?: IDatabaseCreateOptions): Promise<RoleDoc>
    update(
        repository: RoleDoc,
        data: RoleUpdateDto,
        options?: IDatabaseSaveOptions
    ): Promise<RoleDoc>
    updatePermissions(
        repository: RoleDoc,
        data: RoleUpdatePermissionDto,
        options?: IDatabaseSaveOptions
    ): Promise<RoleDoc>
    active(repository: RoleDoc, options?: IDatabaseSaveOptions): Promise<RoleDoc>
    inactive(repository: RoleDoc, options?: IDatabaseSaveOptions): Promise<RoleDoc>
    delete(repository: RoleDoc, options?: IDatabaseSaveOptions): Promise<RoleDoc>
    deleteMany(find: Record<string, any>, options?: IDatabaseManyOptions): Promise<boolean>
    createMany(data: RoleCreateDto[], options?: IDatabaseCreateManyOptions): Promise<boolean>
}
