import { applyDecorators, SerializeOptions, SetMetadata, UseInterceptors } from '@nestjs/common'

import { ENUM_HELPER_FILE_TYPE } from 'constants/helper/helper.enum.constant'
import {
    RESPONSE_FILE_TYPE_META_KEY,
    RESPONSE_MESSAGE_PATH_META_KEY,
    RESPONSE_MESSAGE_PROPERTIES_META_KEY,
    RESPONSE_SERIALIZATION_META_KEY,
} from 'constants/response/response.constant'
import { ResponseDefaultInterceptor } from 'infrastructure/interceptors/response/response.default.interceptor'
import { ResponseFileInterceptor } from 'infrastructure/interceptors/response/response.file.interceptor'
import { ResponsePagingInterceptor } from 'infrastructure/interceptors/response/response.paging.interceptor'
import { IResponseFileOptions, IResponseOptions, IResponsePagingOptions } from 'interfaces'

export function Response<T>(messagePath: string, options?: IResponseOptions<T>): MethodDecorator {
    return applyDecorators(
        UseInterceptors(ResponseDefaultInterceptor<T>),
        SetMetadata(RESPONSE_MESSAGE_PATH_META_KEY, messagePath),
        SetMetadata(RESPONSE_SERIALIZATION_META_KEY, options?.serialization),
        SetMetadata(RESPONSE_MESSAGE_PROPERTIES_META_KEY, options?.messageProperties)
    )
}

export function ResponseFile(options?: IResponseFileOptions<void>): MethodDecorator {
    return applyDecorators(
        UseInterceptors(ResponseFileInterceptor),
        SetMetadata(RESPONSE_SERIALIZATION_META_KEY, options?.serialization),
        SetMetadata(RESPONSE_FILE_TYPE_META_KEY, options?.fileType ?? ENUM_HELPER_FILE_TYPE.CSV),
        SetMetadata(RESPONSE_MESSAGE_PROPERTIES_META_KEY, options?.messageProperties)
    )
}

export function ResponsePaging<T>(
    messagePath: string,
    options: IResponsePagingOptions<T>
): MethodDecorator {
    return applyDecorators(
        UseInterceptors(ResponsePagingInterceptor<T>),
        SetMetadata(RESPONSE_MESSAGE_PATH_META_KEY, messagePath),
        SetMetadata(RESPONSE_SERIALIZATION_META_KEY, options?.serialization),
        SetMetadata(RESPONSE_MESSAGE_PROPERTIES_META_KEY, options?.messageProperties)
    )
}

export const ResponseSerializationOptions = SerializeOptions
