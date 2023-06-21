import { Module } from '@nestjs/common'
import { CommonModule } from 'modules/common.module'
import { AppController } from './controllers/app.controller'

@Module({
    controllers: [AppController],
    providers: [],
    imports: [CommonModule],
})
export class AppModule {}
