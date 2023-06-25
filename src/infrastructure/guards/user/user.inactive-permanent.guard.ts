import { BadRequestException, CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { USER_INACTIVE_PERMANENT_META_KEY } from 'constants/user/user.constant'
import { ENUM_USER_STATUS_CODE_ERROR } from 'constants/user/user.status-code.constant'
import { UserDoc } from 'domain/user/repositories/entities/user.entity'
import { IRequestApp } from 'interfaces'

@Injectable()
export class UserInactivePermanentGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const required: boolean[] = this.reflector.getAllAndOverride<boolean[]>(
            USER_INACTIVE_PERMANENT_META_KEY,
            [context.getHandler(), context.getClass()]
        )

        if (!required) {
            return true
        }

        const { __user } = context.switchToHttp().getRequest<IRequestApp & { __user: UserDoc }>()

        if (!required.includes(__user.inactivePermanent)) {
            throw new BadRequestException({
                statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_INACTIVE_ERROR,
                message: 'user.error.inactivePermanent',
            })
        }
        return true
    }
}
