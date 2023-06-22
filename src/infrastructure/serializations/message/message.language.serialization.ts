import { ApiProperty } from '@nestjs/swagger'
import { ENUM_MESSAGE_LANGUAGE } from 'constants/message/message.enum.constant'

export class MessageLanguageSerialization {
    @ApiProperty({
        required: true,
        nullable: false,
        enum: ENUM_MESSAGE_LANGUAGE,
        type: 'array',
        isArray: true,
    })
    language: ENUM_MESSAGE_LANGUAGE[]
}
