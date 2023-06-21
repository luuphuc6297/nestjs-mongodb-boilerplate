import { registerAs } from '@nestjs/config'
import { seconds } from 'constants/helper/helper.function.constant'

export default registerAs(
    'auth',
    (): Record<string, any> => ({
        accessToken: {
            secretKey: process.env.AUTH_JWT_ACCESS_TOKEN_SECRET_KEY ?? '123456',
            expirationTime: seconds(process.env.AUTH_JWT_ACCESS_TOKEN_EXPIRED ?? '1h'), // 1 hours
            notBeforeExpirationTime: seconds('0'), // immediately

            encryptKey: process.env.AUTH_JWT_PAYLOAD_ACCESS_TOKEN_ENCRYPT_KEY,
            encryptIv: process.env.AUTH_JWT_PAYLOAD_ACCESS_TOKEN_ENCRYPT_IV,
        },

        refreshToken: {
            secretKey: process.env.AUTH_JWT_REFRESH_TOKEN_SECRET_KEY ?? '123456000',
            expirationTime: seconds(process.env.AUTH_JWT_REFRESH_TOKEN_EXPIRED ?? '14d'), // 14 days
            notBeforeExpirationTime: seconds(
                process.env.AUTH_JWT_REFRESH_TOKEN_NOT_BEFORE_EXPIRATION ?? '1h'
            ), // 1 hours

            encryptKey: process.env.AUTH_JWT_PAYLOAD_REFRESH_TOKEN_ENCRYPT_KEY,
            encryptIv: process.env.AUTH_JWT_PAYLOAD_REFRESH_TOKEN_ENCRYPT_IV,
        },

        subject: process.env.AUTH_JWT_SUBJECT ?? 'luuphuc',
        audience: process.env.AUTH_JWT_AUDIENCE ?? 'https://example.com',
        issuer: process.env.AUTH_JWT_ISSUER ?? 'ack',
        prefixAuthorization: 'Bearer',
        payloadEncryption: process.env.AUTH_JWT_PAYLOAD_ENCRYPT === 'true' ? true : false,

        password: {
            attempt: true,
            maxAttempt: 5,
            saltLength: 8,
            expiredIn: seconds('182d'), // 182 days
        },

        googleOAuth2: {
            clientId: process.env.SSO_GOOGLE_CLIENT_ID,
            clientSecret: process.env.SSO_GOOGLE_CLIENT_SECRET,
            callbackUrlLogin: process.env.SSO_GOOGLE_CALLBACK_URL_LOGIN,
            callbackUrlSignUp: process.env.SSO_GOOGLE_CALLBACK_URL_SIGN_UP,
        },
    })
)
