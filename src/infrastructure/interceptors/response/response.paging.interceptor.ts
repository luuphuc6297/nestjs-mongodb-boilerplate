import {
    CallHandler,
    ExecutionContext,
    HttpStatus,
    Injectable,
    NestInterceptor,
} from '@nestjs/common'
import { HttpArgumentsHost } from '@nestjs/common/interfaces'
import { Response } from 'express'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { Reflector } from '@nestjs/core'
import { ClassConstructor, ClassTransformOptions, plainToInstance } from 'class-transformer'
import {
    RESPONSE_MESSAGE_PATH_META_KEY,
    RESPONSE_MESSAGE_PROPERTIES_META_KEY,
    RESPONSE_SERIALIZATION_META_KEY,
    RESPONSE_SERIALIZATION_OPTIONS_META_KEY,
} from 'constants/response/response.constant'
import {
    ResponsePaginationCursorSerialization,
    ResponsePagingMetadataSerialization,
    ResponsePagingSerialization,
} from 'infrastructure/serializations'
import { IMessage, IMessageOptionsProperties, IRequestApp, IResponsePaging } from 'interfaces'
import { HelperArrayService } from 'modules/helper/services/helper.array.service'
import { MessageService } from 'modules/message/services/message.service'
import qs from 'qs'

@Injectable()
export class ResponsePagingInterceptor<T> implements NestInterceptor<Promise<T>> {
    constructor(
        private readonly reflector: Reflector,
        private readonly messageService: MessageService,
        private readonly helperArrayService: HelperArrayService
    ) {}

    async intercept(
        context: ExecutionContext,
        next: CallHandler
    ): Promise<Observable<Promise<ResponsePagingSerialization>>> {
        if (context.getType() === 'http') {
            return next.handle().pipe(
                map(async (res: Promise<IResponsePaging>) => {
                    const ctx: HttpArgumentsHost = context.switchToHttp()
                    const response: Response = ctx.getResponse()
                    const request: IRequestApp = ctx.getRequest<IRequestApp>()

                    let messagePath: string = this.reflector.get<string>(
                        RESPONSE_MESSAGE_PATH_META_KEY,
                        context.getHandler()
                    )
                    const classSerialization: ClassConstructor<any> = this.reflector.get<
                        ClassConstructor<any>
                    >(RESPONSE_SERIALIZATION_META_KEY, context.getHandler())
                    const classSerializationOptions: ClassTransformOptions =
                        this.reflector.get<ClassTransformOptions>(
                            RESPONSE_SERIALIZATION_OPTIONS_META_KEY,
                            context.getHandler()
                        )
                    let messageProperties: IMessageOptionsProperties =
                        this.reflector.get<IMessageOptionsProperties>(
                            RESPONSE_MESSAGE_PROPERTIES_META_KEY,
                            context.getHandler()
                        )

                    // metadata
                    const __customLang = request.__customLang
                    const __path = request.path
                    const __requestId = request.__id
                    const __timestamp = request.__xTimestamp ?? request.__timestamp
                    const __timezone = request.__timezone
                    const __version = request.__version
                    const __repoVersion = request.__repoVersion
                    const __pagination = request.__pagination

                    let httpStatus: HttpStatus = response.statusCode
                    let statusCode: number = response.statusCode
                    let data: Record<string, any>[] = []
                    let metadata: ResponsePagingMetadataSerialization = {
                        languages: __customLang,
                        timestamp: __timestamp,
                        timezone: __timezone,
                        requestId: __requestId,
                        path: __path,
                        version: __version,
                        repoVersion: __repoVersion,
                    }

                    // response
                    const responseData = (await res) as IResponsePaging
                    if (!responseData) {
                        throw new Error('Paging must have response')
                    }

                    const { _metadata } = responseData
                    data = responseData.data

                    if (classSerialization) {
                        data = plainToInstance(classSerialization, data, classSerializationOptions)
                    }

                    httpStatus = _metadata?.customProperty?.httpStatus ?? httpStatus
                    statusCode = _metadata?.customProperty?.statusCode ?? statusCode
                    messagePath = _metadata?.customProperty?.message ?? messagePath
                    messageProperties =
                        _metadata?.customProperty?.messageProperties ?? messageProperties

                    delete _metadata?.customProperty

                    // metadata pagination

                    const { query } = request

                    delete query.perPage

                    delete query.page

                    const total: number = responseData._pagination.total

                    const totalPage: number = responseData._pagination.totalPage

                    const perPage: number = __pagination.perPage
                    const page: number = __pagination.page

                    const queryString = qs.stringify(query, {
                        encode: false,
                    })

                    const cursorPaginationMetadata: ResponsePaginationCursorSerialization = {
                        nextPage:
                            page < totalPage
                                ? `${__path}?perPage=${perPage}&page=${page + 1}&${queryString}`
                                : undefined,
                        previousPage:
                            page > 1
                                ? `${__path}?perPage=${perPage}&page=${page - 1}&${queryString}`
                                : undefined,
                        firstPage:
                            totalPage > 1
                                ? `${__path}?perPage=${perPage}&page=${1}&${queryString}`
                                : undefined,
                        lastPage:
                            totalPage > 1
                                ? `${__path}?perPage=${perPage}&page=${totalPage}&${queryString}`
                                : undefined,
                    }

                    metadata = {
                        ...metadata,
                        ..._metadata,
                        pagination: {
                            ...__pagination,
                            ...metadata._pagination,
                            total,
                            totalPage,
                        },
                    }

                    if (
                        !this.helperArrayService.includes(
                            Object.values(cursorPaginationMetadata),
                            undefined
                        )
                    ) {
                        metadata.cursor = cursorPaginationMetadata
                    }

                    const message: string | IMessage = await this.messageService.get(messagePath, {
                        customLanguages: __customLang,
                        properties: messageProperties,
                    })

                    response.status(httpStatus)

                    return {
                        statusCode,
                        message,
                        _metadata: metadata,
                        data,
                    }
                })
            )
        }

        return next.handle()
    }
}
