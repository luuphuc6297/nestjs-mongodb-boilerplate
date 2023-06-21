import { HttpStatus } from '@nestjs/common'
import { IMessageOptionsProperties } from 'interfaces'

export interface IResponseCustomPropertyMetadata {
    statusCode?: number
    message?: string
    httpStatus?: HttpStatus
    messageProperties?: IMessageOptionsProperties
}
