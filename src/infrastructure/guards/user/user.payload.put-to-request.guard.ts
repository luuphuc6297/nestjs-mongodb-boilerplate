import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { UserDoc } from 'domain/user/repositories/entities/user.entity'
import { UserService } from 'domain/user/services/user.service'
import { IRequestApp } from 'interfaces'

@Injectable()
export class UserPayloadPutToRequestGuard implements CanActivate {
    constructor(private readonly userService: UserService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<IRequestApp & { __user: UserDoc }>()
        const { user } = request

        const check: UserDoc = await this.userService.findOneById(user._id, {
            join: true,
        })
        request.__user = check

        return true
    }
}
