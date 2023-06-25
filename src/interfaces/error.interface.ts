import { ValidationError } from 'class-validator'
import { IMessage } from './message.interface'
import { IResponseCustomPropertyMetadata } from './response.interface'
import { ERROR_TYPE } from 'constants/error/error.enum.constant'

// error default
export interface IErrors {
    readonly message: string | IMessage
    readonly property: string
}

// error import
export interface IErrorsImport {
    row: number
    file?: string
    errors: IErrors[]
}

export interface IValidationErrorImport extends Omit<IErrorsImport, 'errors'> {
    errors: ValidationError[]
}

// error exception

export type IErrorCustomPropertyMetadata = Pick<
    IResponseCustomPropertyMetadata,
    'messageProperties'
>

export interface IErrorMetadata {
    customProperty?: IErrorCustomPropertyMetadata
    [key: string]: any
}

export interface IErrorException {
    statusCode: number
    message: string
    errors?: ValidationError[] | IValidationErrorImport[]
    data?: Record<string, any>
    _error?: string
    _errorType?: ERROR_TYPE
    _metadata?: IErrorMetadata
}

export interface IErrorHttpFilter extends Omit<IErrorException, '_errorType' | 'message'> {
    message: string | IMessage
}
