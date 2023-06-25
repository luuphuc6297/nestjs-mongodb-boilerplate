import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { HttpArgumentsHost } from '@nestjs/common/interfaces'
import { Response } from 'express'
import { IRequestApp } from 'interfaces'
import { Observable } from 'rxjs'

// only for response success and error in controller
@Injectable()
export class ResponseCustomHeadersInterceptor implements NestInterceptor<Promise<any>> {
    async intercept(
        context: ExecutionContext,
        next: CallHandler
    ): Promise<Observable<Promise<any> | string>> {
        if (context.getType() === 'http') {
            const ctx: HttpArgumentsHost = context.switchToHttp()
            const responseExpress: Response = ctx.getResponse()
            const request: IRequestApp = ctx.getRequest()

            responseExpress.setHeader('x-custom-lang', request.__xCustomLang)
            responseExpress.setHeader('x-timestamp', request.__xTimestamp ?? request.__timestamp)
            responseExpress.setHeader('x-timezone', request.__timezone)
            responseExpress.setHeader('x-request-id', request.__id)
            responseExpress.setHeader('x-version', request.__version)
            responseExpress.setHeader('x-repo-version', request.__repoVersion)

            return next.handle()
        }

        return next.handle()
    }
}
