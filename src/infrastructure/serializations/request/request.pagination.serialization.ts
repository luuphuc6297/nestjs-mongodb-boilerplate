import { faker } from '@faker-js/faker'
import { ApiProperty } from '@nestjs/swagger'

export class RequestPaginationSerialization {
    @ApiProperty({
        required: true,
        nullable: false,
        example: faker.person.firstName(),
    })
    search: string

    @ApiProperty({
        required: true,
        nullable: false,
        example: 1,
    })
    page: number
}
