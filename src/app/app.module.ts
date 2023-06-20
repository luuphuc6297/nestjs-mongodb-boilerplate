import { Module } from '@nestjs/common'
import { MainModule } from 'modules/main.module'
import { AppController } from './controllers/app.controller'

@Module({
    controllers: [AppController],
    providers: [],
    imports: [MainModule],
})
export class AppModule {}
