import { ApiHideProperty, ApiProperty, OmitType } from '@nestjs/swagger'
import { Exclude, Type } from 'class-transformer'
import {
    AwsS3Serialization,
    RoleListSerialization,
    UserProfileSerialization,
} from 'infrastructure/serializations'

export class UserListSerialization extends OmitType(UserProfileSerialization, [
    'photo',
    'signUpDate',
    'signUpFrom',
    'role',
] as const) {
    @ApiProperty({
        type: () => RoleListSerialization,
        required: true,
        nullable: false,
    })
    @Type(() => RoleListSerialization)
    readonly role: RoleListSerialization

    @ApiHideProperty()
    @Exclude()
    readonly photo?: AwsS3Serialization

    @ApiHideProperty()
    @Exclude()
    readonly signUpDate: Date
}
