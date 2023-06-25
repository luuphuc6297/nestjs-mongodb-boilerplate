import {
    applyDecorators,
    createParamDecorator,
    ExecutionContext,
    SetMetadata,
    UseGuards,
} from '@nestjs/common'
import {
    USER_ACTIVE_META_KEY,
    USER_BLOCKED_META_KEY,
    USER_INACTIVE_PERMANENT_META_KEY,
} from 'constants/user/user.constant'
import { UserDoc, UserEntity } from 'domain/user/repositories/entities/user.entity'
import {
    UserActiveGuard,
    UserBlockedGuard,
    UserInactivePermanentGuard,
    UserNotFoundGuard,
    UserPayloadPutToRequestGuard,
} from 'infrastructure/guards'

import { IRequestApp } from 'interfaces'

export const GetUser = createParamDecorator(
    (returnPlain: boolean, ctx: ExecutionContext): UserDoc | UserEntity => {
        const { __user } = ctx.switchToHttp().getRequest<IRequestApp & { __user: UserDoc }>()
        return returnPlain ? __user.toObject() : __user
    }
)

export function UserProtected(): MethodDecorator {
    return applyDecorators(UseGuards(UserPayloadPutToRequestGuard, UserNotFoundGuard))
}

export function UserAuthProtected(): MethodDecorator {
    return applyDecorators(
        UseGuards(UserBlockedGuard, UserInactivePermanentGuard, UserActiveGuard),
        SetMetadata(USER_INACTIVE_PERMANENT_META_KEY, [false]),
        SetMetadata(USER_BLOCKED_META_KEY, [false]),
        SetMetadata(USER_ACTIVE_META_KEY, [true])
    )
}
