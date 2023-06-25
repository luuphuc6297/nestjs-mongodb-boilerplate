import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { MessageCustomLanguageMiddleware } from './message.custom-language.middleware'

@Module({})
export class MessageMiddlewareModule implements NestModule {
    configure(consumer: MiddlewareConsumer): void {
        consumer.apply(MessageCustomLanguageMiddleware).forRoutes('*')
    }
}
