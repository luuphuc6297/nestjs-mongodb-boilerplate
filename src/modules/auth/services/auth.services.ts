import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import {
    IAuthPassword,
    IAuthPayloadOptions,
    IAuthRefreshTokenOptions,
    IAuthService,
} from 'interfaces'
import { HelperDateService } from 'modules/helper/services/helper.date.service'
import { HelperEncryptionService } from 'modules/helper/services/helper.encryption.service'
import { HelperHashService } from 'modules/helper/services/helper.hash.service'
import { HelperStringService } from 'modules/helper/services/helper.string.service'

@Injectable()
export class AuthService implements IAuthService {
    private readonly accessTokenSecretKey: string
    private readonly accessTokenExpirationTime: number
    private readonly accessTokenNotBeforeExpirationTime: number
    private readonly accessTokenEncryptKey: string
    private readonly accessTokenEncryptIv: string

    private readonly refreshTokenSecretKey: string
    private readonly refreshTokenExpirationTime: number
    private readonly refreshTokenNotBeforeExpirationTime: number
    private readonly refreshTokenEncryptKey: string
    private readonly refreshTokenEncryptIv: string

    private readonly payloadEncryption: boolean
    private readonly prefixAuthorization: string
    private readonly audience: string
    private readonly issuer: string
    private readonly subject: string

    private readonly passwordExpiredIn: number
    private readonly passwordSaltLength: number

    constructor(
        private readonly helperHashService: HelperHashService,
        private readonly helperDateService: HelperDateService,
        private readonly helperStringService: HelperStringService,
        private readonly helperEncryptionService: HelperEncryptionService,
        private readonly configService: ConfigService
    ) {
        this.accessTokenSecretKey = this.configService.get<string>('auth.accessToken.secretKey')
        this.accessTokenExpirationTime = this.configService.get<number>(
            'auth.accessToken.expirationTime'
        )
        this.accessTokenNotBeforeExpirationTime = this.configService.get<number>(
            'auth.accessToken.notBeforeExpirationTime'
        )
        this.accessTokenEncryptKey = this.configService.get<string>('auth.accessToken.encryptKey')
        this.accessTokenEncryptIv = this.configService.get<string>('auth.accessToken.encryptIv')

        this.refreshTokenSecretKey = this.configService.get<string>('auth.refreshToken.secretKey')
        this.refreshTokenExpirationTime = this.configService.get<number>(
            'auth.refreshToken.expirationTime'
        )
        this.refreshTokenNotBeforeExpirationTime = this.configService.get<number>(
            'auth.refreshToken.notBeforeExpirationTime'
        )
        this.refreshTokenEncryptKey = this.configService.get<string>('auth.refreshToken.encryptKey')
        this.refreshTokenEncryptIv = this.configService.get<string>('auth.refreshToken.encryptIv')

        this.payloadEncryption = this.configService.get<boolean>('auth.payloadEncryption')
        this.prefixAuthorization = this.configService.get<string>('auth.prefixAuthorization')
        this.subject = this.configService.get<string>('auth.subject')
        this.audience = this.configService.get<string>('auth.audience')
        this.issuer = this.configService.get<string>('auth.issuer')

        this.passwordExpiredIn = this.configService.get<number>('auth.password.expiredIn')
        this.passwordSaltLength = this.configService.get<number>('auth.password.saltLength')
    }

    async encryptAccessToken(payload: Record<string, any>): Promise<string> {
        return this.helperEncryptionService.aes256Encrypt(
            payload,
            this.accessTokenEncryptKey,
            this.accessTokenEncryptIv
        )
    }

    async decryptAccessToken({ data }: Record<string, any>): Promise<Record<string, any>> {
        return this.helperEncryptionService.aes256Decrypt(
            data,
            this.accessTokenEncryptKey,
            this.accessTokenEncryptIv
        ) as Record<string, any>
    }

    async createAccessToken(payloadHashed: string | Record<string, any>): Promise<string> {
        return this.helperEncryptionService.jwtEncrypt(
            { data: payloadHashed },
            {
                secretKey: this.accessTokenSecretKey,
                expiredIn: this.accessTokenExpirationTime,
                notBefore: this.accessTokenNotBeforeExpirationTime,
                audience: this.audience,
                issuer: this.issuer,
                subject: this.subject,
            }
        )
    }

    async validateAccessToken(token: string): Promise<boolean> {
        return this.helperEncryptionService.jwtVerify(token, {
            secretKey: this.accessTokenSecretKey,
            audience: this.audience,
            issuer: this.issuer,
            subject: this.subject,
        })
    }

    async payloadAccessToken(token: string): Promise<Record<string, any>> {
        return this.helperEncryptionService.jwtDecrypt(token)
    }

    async encryptRefreshToken(payload: Record<string, any>): Promise<string> {
        return this.helperEncryptionService.aes256Encrypt(
            payload,
            this.refreshTokenEncryptKey,
            this.refreshTokenEncryptIv
        )
    }
    async decryptRefreshToken({ data }: Record<string, any>): Promise<Record<string, any>> {
        return this.helperEncryptionService.aes256Decrypt(
            data,
            this.refreshTokenEncryptKey,
            this.refreshTokenEncryptIv
        ) as Record<string, any>
    }

    async createRefreshToken(
        payloadHashed: string | Record<string, any>,
        options?: IAuthRefreshTokenOptions
    ): Promise<string> {
        return this.helperEncryptionService.jwtEncrypt(
            { data: payloadHashed },
            {
                secretKey: this.refreshTokenSecretKey,
                expiredIn: this.refreshTokenExpirationTime,
                notBefore:
                    options?.notBeforeExpirationTime ?? this.refreshTokenNotBeforeExpirationTime,
                audience: this.audience,
                issuer: this.issuer,
                subject: this.subject,
            }
        )
    }

    async validateRefreshToken(token: string): Promise<boolean> {
        return this.helperEncryptionService.jwtVerify(token, {
            secretKey: this.refreshTokenSecretKey,
            audience: this.audience,
            issuer: this.issuer,
            subject: this.subject,
        })
    }

    async payloadRefreshToken(token: string): Promise<Record<string, any>> {
        return this.helperEncryptionService.jwtDecrypt(token)
    }

    async validateUser(passwordString: string, passwordHash: string): Promise<boolean> {
        return this.helperHashService.bcryptCompare(passwordString, passwordHash)
    }

    async createPayloadAccessToken(data: Record<string, any>): Promise<Record<string, any>> {
        return data
    }

    async createPayloadRefreshToken(
        _id: string,
        options: IAuthPayloadOptions
    ): Promise<Record<string, any>> {
        return {
            _id,
            loginDate: this.helperDateService.create(),
            loginWith: options.loginWith,
        }
    }

    async createSalt(length: number): Promise<string> {
        return this.helperHashService.randomSalt(length)
    }

    async createPassword(password: string): Promise<IAuthPassword> {
        const salt: string = await this.createSalt(this.passwordSaltLength)

        const passwordExpired: Date = this.helperDateService.forwardInSeconds(
            this.passwordExpiredIn
        )
        const passwordCreated: Date = this.helperDateService.create()
        const passwordHash = this.helperHashService.bcrypt(password, salt)
        return {
            passwordHash,
            passwordExpired,
            passwordCreated,
            salt,
        }
    }

    async createPasswordRandom(): Promise<string> {
        return this.helperStringService.random(15)
    }

    async checkPasswordExpired(passwordExpired: Date): Promise<boolean> {
        const today: Date = this.helperDateService.create()
        const passwordExpiredConvert: Date = this.helperDateService.create(passwordExpired)

        return today > passwordExpiredConvert
    }

    async getTokenType(): Promise<string> {
        return this.prefixAuthorization
    }

    async getAccessTokenExpirationTime(): Promise<number> {
        return this.accessTokenExpirationTime
    }

    async getRefreshTokenExpirationTime(): Promise<number> {
        return this.refreshTokenExpirationTime
    }

    async getIssuer(): Promise<string> {
        return this.issuer
    }

    async getAudience(): Promise<string> {
        return this.audience
    }

    async getSubject(): Promise<string> {
        return this.subject
    }

    async getPayloadEncryption(): Promise<boolean> {
        return this.payloadEncryption
    }
}
