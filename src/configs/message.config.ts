import { registerAs } from '@nestjs/config'
import { APP_LANGUAGE } from 'constants/app/app.constant'
import { ENUM_MESSAGE_LANGUAGE } from 'constants/message/message.enum.constant'

export default registerAs(
    'message',
    (): Record<string, any> => ({
        availableLanguage: Object.values(ENUM_MESSAGE_LANGUAGE),
        language: process.env.APP_LANGUAGE ?? APP_LANGUAGE,
    })
)
