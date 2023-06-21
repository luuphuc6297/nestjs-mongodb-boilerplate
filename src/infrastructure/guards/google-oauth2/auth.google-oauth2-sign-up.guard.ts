import { Injectable, UnauthorizedException } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ENUM_AUTH_STATUS_CODE_ERROR } from 'constants/auth/auth.status-code.constant'

@Injectable()
export class AuthGoogleOauth2SignUpGuard extends AuthGuard('googleSignUp') {
    constructor() {
        super({
            accessType: 'offline',
            prompt: 'consent',
        })
    }

    handleRequest<TUser = any>(err: Error, user: TUser, info: Error): TUser {
        if (err || !user) {
            throw new UnauthorizedException({
                statusCode: ENUM_AUTH_STATUS_CODE_ERROR.AUTH_GOOGLE_SSO_ERROR,
                message: 'auth.error.googleSSO',
                _error: err ? err.message : info.message,
            })
        }

        return user
    }
}
