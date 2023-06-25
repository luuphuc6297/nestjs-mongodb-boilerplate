import {
    ExecutionContext,
    SetMetadata,
    UseGuards,
    applyDecorators,
    createParamDecorator,
} from '@nestjs/common'
import { ROLE_TYPE_META_KEY } from 'constants/role/role.constant'
import { ENUM_ROLE_TYPE } from 'constants/role/role.enum.constant'
import { AuthJwtAccessGuard, RolePayloadTypeGuard } from 'infrastructure/guards'
import { UserPayloadSerialization } from 'infrastructure/serializations'
import { IRequestApp } from 'interfaces'

export const AuthJwtPayload = createParamDecorator(
    (data: string, ctx: ExecutionContext): Record<string, any> => {
        const { user } = ctx
            .switchToHttp()
            .getRequest<IRequestApp & { user: UserPayloadSerialization }>()
        return data ? user[data] : user
    }
)

export const AuthJwtToken = createParamDecorator((data: string, ctx: ExecutionContext): string => {
    const { headers } = ctx.switchToHttp().getRequest<IRequestApp>()
    const { authorization } = headers
    const authorizations: string[] = authorization.split(' ')

    return authorizations.length >= 2 ? authorizations[1] : undefined
})

export function AuthJwtAccessProtected(): MethodDecorator {
    return applyDecorators(UseGuards(AuthJwtAccessGuard))
}

export function AuthJwtUserAccessProtected(): MethodDecorator {
    return applyDecorators(
        UseGuards(AuthJwtAccessGuard, RolePayloadTypeGuard),
        SetMetadata(ROLE_TYPE_META_KEY, [ENUM_ROLE_TYPE.USER])
    )
}
