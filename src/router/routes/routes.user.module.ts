import { Module } from '@nestjs/common'
import { RoleModule } from 'domain/role/role.module'
import { UserUserController } from 'domain/user/controllers/user.user.controller'
import { UserModule } from 'domain/user/user.module'

@Module({
    controllers: [UserUserController],
    providers: [],
    exports: [],
    imports: [UserModule, RoleModule],
})
export class RoutesUserModule {}
