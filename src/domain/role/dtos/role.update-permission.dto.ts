import { OmitType } from '@nestjs/swagger'
import { RoleCreateDto } from './role.create.dto'

export class RoleUpdatePermissionDto extends OmitType(RoleCreateDto, ['name'] as const) {}
