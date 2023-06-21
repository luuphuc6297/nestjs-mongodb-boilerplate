import { ApiProperty, PickType } from '@nestjs/swagger'
import {
    RequestPaginationSerialization,
    ResponseDefaultSerialization,
    ResponseMetadataSerialization,
} from 'infrastructure/serializations'

export class ResponsePaginationCursorSerialization {
    nextPage: string
    previousPage: string
    firstPage: string
    lastPage: string
}

export class ResponsePaginationSerialization extends RequestPaginationSerialization {
    total: number
    totalPage: number
}

export interface ResponsePagingMetadataSerialization extends ResponseMetadataSerialization {
    cursor?: ResponsePaginationCursorSerialization
    pagination?: ResponsePaginationSerialization
}

export class ResponsePagingSerialization<T = Record<string, any>> extends PickType(
    ResponseDefaultSerialization,
    ['statusCode', 'message'] as const
) {
    @ApiProperty({
        name: 'statusCode',
        type: Number,
        required: true,
        nullable: false,
        description: 'return specific status code for every endpoints',
        example: 200,
    })
    statusCode: number
}
