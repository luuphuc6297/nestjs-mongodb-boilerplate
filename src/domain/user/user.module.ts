import { Module } from '@nestjs/common'
import { UserRepositoryModule } from 'domain/user/repositories/user.repository.module'
import { UserService } from 'domain/user/services/user.service'

@Module({
    imports: [UserRepositoryModule],
    exports: [UserService],
    providers: [UserService],
    controllers: [],
})
export class UserModule {}
