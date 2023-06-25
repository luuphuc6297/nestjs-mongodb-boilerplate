import { faker } from '@faker-js/faker'
import { ApiProperty, PartialType } from '@nestjs/swagger'
import { Transform, Type } from 'class-transformer'
import {
    ArrayNotEmpty,
    IsArray,
    IsEnum,
    IsNotEmpty,
    IsString,
    MaxLength,
    MinLength,
    ValidateIf,
} from 'class-validator'
import { ENUM_POLICY_ACTION, ENUM_POLICY_SUBJECT } from 'constants/policy/policy.enum.constant'
import { ENUM_ROLE_TYPE } from 'constants/role/role.enum.constant'
import { RoleUpdateDto } from './role.update.dto'

class RolePermissionsDto {
    @ApiProperty({
        required: true,
        description: 'Permission subject',
        enum: ENUM_POLICY_SUBJECT,
    })
    @IsNotEmpty()
    @IsString()
    @IsEnum(ENUM_POLICY_SUBJECT)
    subject: ENUM_POLICY_SUBJECT

    @ApiProperty({
        required: true,
        description: 'Permission action base on subject',
        isArray: true,
        default: [],
        enum: ENUM_POLICY_ACTION,
    })
    @IsString({ each: true })
    @IsEnum(ENUM_POLICY_ACTION, { each: true })
    @IsArray()
    @IsNotEmpty()
    @ArrayNotEmpty()
    action: ENUM_POLICY_ACTION[]
}

export class RoleCreateDto extends PartialType(RoleUpdateDto) {
    @ApiProperty({
        description: 'Name of role',
        example: faker.person.jobTitle(),
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(30)
    @Type(() => String)
    readonly name: string

    @ApiProperty({
        description: 'Representative for role type',
        example: 'ADMIN',
        required: true,
    })
    @IsEnum(ENUM_ROLE_TYPE)
    @IsNotEmpty()
    readonly type: ENUM_ROLE_TYPE

    @ApiProperty({
        required: true,
        description: 'Permission list of role',
        isArray: true,
        default: [],
        type: () => RolePermissionsDto,
    })
    @Type(() => RolePermissionsDto)
    @IsNotEmpty()
    @IsArray()
    @ValidateIf((e) => e.type === ENUM_ROLE_TYPE.ADMIN)
    @Transform(({ value, obj }) => (obj.type !== ENUM_ROLE_TYPE.ADMIN ? [] : value))
    readonly permissions: RolePermissionsDto[]
}
