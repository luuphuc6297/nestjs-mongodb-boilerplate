import { Controller, Delete } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { UserDoc } from 'domain/user/repositories/entities/user.entity'
import { UserService } from 'domain/user/services/user.service'
import {
    AuthJwtUserAccessProtected,
    GetUser,
    Response,
    UserProtected,
} from 'infrastructure/decorators'

@ApiTags('modules.user.user')
@Controller({
    version: '1',
    path: '/user',
})
export class UserUserController {
    constructor(private readonly userService: UserService) {}

    // @UserUserDeleteSelfDoc()
    @Response('user.deleteSelf')
    @UserProtected()
    @AuthJwtUserAccessProtected()
    @Delete('/delete')
    async deleteSelf(@GetUser() user: UserDoc): Promise<void> {
        await this.userService.inactivePermanent(user)

        return
    }
}
