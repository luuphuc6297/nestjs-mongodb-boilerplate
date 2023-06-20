import { Module } from '@nestjs/common'
import { DatabaseOptionsService } from './providers/database.services'

@Module({
    providers: [DatabaseOptionsService],
    exports: [DatabaseOptionsService],
    imports: [],
    controllers: [],
})
export class DatabaseOptionsModule {}
