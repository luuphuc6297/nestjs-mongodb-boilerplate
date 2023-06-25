import { applyDecorators } from '@nestjs/common'
import { Doc, DocResponse } from 'infrastructure/decorators/docs/doc.decorator'
import { MessageLanguageSerialization } from 'infrastructure/serializations'

export function MessagePublicLanguageDoc(): MethodDecorator {
    return applyDecorators(
        Doc({ operation: 'common.public.message' }),
        DocResponse<MessageLanguageSerialization>('apiKey.languages', {
            serialization: MessageLanguageSerialization,
        })
    )
}
