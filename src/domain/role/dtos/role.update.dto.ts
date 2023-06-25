import { faker } from '@faker-js/faker'
import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsNotEmpty, IsString } from 'class-validator'

export class RoleUpdateDto {
    @ApiProperty({
        description: 'Description of role',
        example: faker.lorem.sentence(),
        required: false,
        nullable: true,
    })
    @IsString()
    @IsNotEmpty()
    @Type(() => String)
    readonly description: string
}
