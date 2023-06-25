import { Module } from '@nestjs/common'
import { RoleRepositoryModule } from './repositories/role.repository.module'
import { RoleService } from './services/role.service'

@Module({
    controllers: [],
    providers: [RoleService],
    exports: [RoleService],
    imports: [RoleRepositoryModule],
})
export class RoleModule {}
