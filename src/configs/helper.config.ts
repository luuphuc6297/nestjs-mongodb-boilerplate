import { registerAs } from '@nestjs/config'
import { seconds } from 'constants/helper/helper.function.constant'

export default registerAs(
    'helper',
    (): Record<string, any> => ({
        salt: {
            length: 8,
        },
        jwt: {
            secretKey: '123456',
            expirationTime: seconds('1h'),
            notBeforeExpirationTime: seconds('0'),
        },
    })
)
