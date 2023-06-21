import { HttpStatus } from '@nestjs/common'
import { IMessageOptionsProperties } from 'interfaces/message/message.interface'

export interface IResponseCustomPropertyMetadata {
    statusCode?: number
    message?: string
    httpStatus?: HttpStatus
    messageProperties?: IMessageOptionsProperties
}
