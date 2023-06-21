import { ApiProperty, OmitType } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { RoleGetSerialization } from './role.get.serialization'

export class RoleListSerialization extends OmitType(RoleGetSerialization, [
    'permissions',
] as const) {
    @ApiProperty({
        description: 'count of permissions',
        required: true,
    })
    @Transform(({ value }) => value.length)
    permissions: number
}
