import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { UserDoc } from 'domain/user/repositories/entities/user.entity'
import { UserService } from 'domain/user/services/user.service'
import { IRequestApp } from 'interfaces'

@Injectable()
export class UserPutToRequestGuard implements CanActivate {
    constructor(private readonly userService: UserService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<IRequestApp & { __user: UserDoc }>()
        const { params } = request
        const { user } = params

        const check: UserDoc = await this.userService.findOneById(user, {
            join: true,
        })
        request.__user = check

        return true
    }
}
