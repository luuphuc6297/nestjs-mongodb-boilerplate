import { Module } from '@nestjs/common'
import { UserUserController } from 'domain/user/controllers/user.user.controller'
import { UserModule } from 'domain/user/user.module'

@Module({
    controllers: [UserUserController],
    providers: [],
    exports: [],
    imports: [UserModule],
})
export class RoutesUserModule {}
