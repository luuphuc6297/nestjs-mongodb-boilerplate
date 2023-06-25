import { Module } from '@nestjs/common'
import { CommonModule } from 'modules/common.module'
import { RouterModule } from 'router/router.module'
import { AppController } from './controllers/app.controller'

@Module({
    controllers: [AppController],
    providers: [],
    imports: [
        CommonModule,

        // Routes
        RouterModule.forRoot(),
    ],
})
export class AppModule {}
