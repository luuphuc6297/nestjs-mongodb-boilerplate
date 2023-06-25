import { CanActivate, ExecutionContext, Injectable, NotFoundException } from '@nestjs/common'
import { ENUM_USER_STATUS_CODE_ERROR } from 'constants/user/user.status-code.constant'
import { UserDoc } from 'domain/user/repositories/entities/user.entity'
import { IRequestApp } from 'interfaces'

@Injectable()
export class UserNotFoundGuard implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const { __user } = context.switchToHttp().getRequest<IRequestApp & { __user: UserDoc }>()

        if (!__user) {
            throw new NotFoundException({
                statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_NOT_FOUND_ERROR,
                message: 'user.error.notFound',
            })
        }

        return true
    }
}
