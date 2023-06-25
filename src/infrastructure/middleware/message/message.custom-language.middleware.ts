import { Injectable, NestMiddleware } from '@nestjs/common'
import { NextFunction, Response } from 'express'
import { IRequestApp } from 'interfaces'
import { HelperArrayService } from 'modules/helper/services/helper.array.service'
import { MessageService } from 'modules/message/services/message.service'

@Injectable()
export class MessageCustomLanguageMiddleware implements NestMiddleware {
    constructor(
        private readonly helperArrayService: HelperArrayService,
        private readonly messageService: MessageService
    ) {}

    async use(req: IRequestApp, res: Response, next: NextFunction): Promise<void> {
        let language: string = this.messageService.getLanguage()
        const availableLanguages: string[] = this.messageService.getAvailableLanguages()
        let customLang: string[] = [language]

        const reqLanguages: string = req.headers['x-custom-lang'] as string
        if (reqLanguages) {
            const splitLanguage: string[] = reqLanguages.split(',').map((val) => val.toLowerCase())
            const languages: string[] = this.helperArrayService.filterIncludeUniqueByArray(
                availableLanguages,
                splitLanguage
            )

            if (languages.length > 0) {
                language = languages.join(',')
                customLang = languages
            }
        }

        req.__customLang = customLang
        req.__xCustomLang = language
        req.headers['x-custom-lang'] = language

        next()
    }
}
