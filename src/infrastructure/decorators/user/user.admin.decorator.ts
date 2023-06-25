import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common'
import {
    USER_ACTIVE_META_KEY,
    USER_BLOCKED_META_KEY,
    USER_INACTIVE_PERMANENT_META_KEY,
} from 'constants/user/user.constant'
import { UserActiveGuard } from 'infrastructure/guards/user/user.active.guard'
import { UserBlockedGuard } from 'infrastructure/guards/user/user.blocked.guard'
import { UserCanNotOurSelfGuard } from 'infrastructure/guards/user/user.can-not-ourself.guard'
import { UserInactivePermanentGuard } from 'infrastructure/guards/user/user.inactive-permanent.guard'
import { UserNotFoundGuard } from 'infrastructure/guards/user/user.not-found.guard'
import { UserPutToRequestGuard } from 'infrastructure/guards/user/user.put-to-request.guard'

export function UserAdminGetGuard(): MethodDecorator {
    return applyDecorators(UseGuards(UserPutToRequestGuard, UserNotFoundGuard))
}

export function UserAdminDeleteGuard(): MethodDecorator {
    return applyDecorators(
        UseGuards(UserPutToRequestGuard, UserNotFoundGuard, UserCanNotOurSelfGuard)
    )
}

export function UserAdminUpdateGuard(): MethodDecorator {
    return applyDecorators(
        UseGuards(UserPutToRequestGuard, UserNotFoundGuard, UserCanNotOurSelfGuard)
    )
}

export function UserAdminUpdateInactiveGuard(): MethodDecorator {
    return applyDecorators(
        UseGuards(
            UserPutToRequestGuard,
            UserNotFoundGuard,
            UserCanNotOurSelfGuard,
            UserBlockedGuard,
            UserInactivePermanentGuard,
            UserActiveGuard
        ),
        SetMetadata(USER_INACTIVE_PERMANENT_META_KEY, [false]),
        SetMetadata(USER_ACTIVE_META_KEY, [true]),
        SetMetadata(USER_BLOCKED_META_KEY, [false])
    )
}

export function UserAdminUpdateActiveGuard(): MethodDecorator {
    return applyDecorators(
        UseGuards(
            UserPutToRequestGuard,
            UserNotFoundGuard,
            UserCanNotOurSelfGuard,
            UserBlockedGuard,
            UserInactivePermanentGuard,
            UserActiveGuard
        ),
        SetMetadata(USER_INACTIVE_PERMANENT_META_KEY, [false]),
        SetMetadata(USER_ACTIVE_META_KEY, [false]),
        SetMetadata(USER_BLOCKED_META_KEY, [false])
    )
}

export function UserAdminUpdateBlockedGuard(): MethodDecorator {
    return applyDecorators(
        UseGuards(
            UserPutToRequestGuard,
            UserNotFoundGuard,
            UserCanNotOurSelfGuard,
            UserBlockedGuard
        ),
        SetMetadata(USER_BLOCKED_META_KEY, [false])
    )
}
