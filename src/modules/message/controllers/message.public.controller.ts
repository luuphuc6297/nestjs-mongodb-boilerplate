import { Controller, Get, VERSION_NEUTRAL } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { MessagePublicLanguageDoc } from 'constants/doc/message/message.public.doc'
import { Response } from 'infrastructure/decorators'
import { MessageLanguageSerialization } from 'infrastructure/serializations/message/message.language.serialization'
import { IResponse } from 'interfaces'
import { MessageService } from '../services/message.service'

@ApiTags('common.public.message')
@Controller({
    version: VERSION_NEUTRAL,
    path: '/message',
})
export class MessagePublicController {
    constructor(private readonly messageService: MessageService) {}

    @MessagePublicLanguageDoc()
    @Response('message.languages', {
        serialization: MessageLanguageSerialization,
    })
    @Get('/languages')
    async languages(): Promise<IResponse> {
        const languages: string[] = this.messageService.getAvailableLanguages()

        return {
            data: { languages },
        }
    }
}
