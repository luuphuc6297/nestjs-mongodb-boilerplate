import { HttpStatus } from '@nestjs/common'
import { ApiParamOptions, ApiQueryOptions } from '@nestjs/swagger'
import { ClassConstructor } from 'class-transformer'
import { ENUM_DOC_REQUEST_BODY_TYPE } from 'constants/doc/doc.enum.constant'
import { ENUM_FILE_EXCEL_MIME } from 'constants/file/file.enum.constant'

export interface IDocOptions {
    operation?: string
    deprecated?: boolean
    description?: string
}

export interface IDocOfOptions {
    statusCode: number
    messagePath: string
    serialization?: ClassConstructor<any>
}

export interface IDocDefaultOptions extends IDocOfOptions {
    httpStatus: HttpStatus
}

export interface IDocAuthOptions {
    jwtAccessToken?: boolean
    jwtRefreshToken?: boolean
    apiKey?: boolean
}

export interface IDocRequestOptions {
    params?: ApiParamOptions[]
    queries?: ApiQueryOptions[]
    bodyType?: ENUM_DOC_REQUEST_BODY_TYPE
}

export interface IDocRequestFileOptions extends Omit<IDocRequestOptions, 'bodyType'> {
    file: {
        multiple: boolean
    }
}

export interface IDocGuardOptions {
    userAgent?: boolean
    timestamp?: boolean
    role?: boolean
    policy?: boolean
}

export interface IDocResponseOptions<T> {
    statusCode?: number
    httpStatus?: HttpStatus
    serialization?: ClassConstructor<T>
}

export interface IDocResponsePagingOptions<T>
    extends Omit<IDocResponseOptions<T>, 'serialization'> {
    serialization: ClassConstructor<T>
}

export interface IDocResponseFileOptions
    extends Omit<IDocResponseOptions<any>, 'serialization' | 'statusCode'> {
    fileType?: ENUM_FILE_EXCEL_MIME
}

export interface IDocErrorOptions<T> {
    messagePath: string
    options?: IDocResponseOptions<T>
}
