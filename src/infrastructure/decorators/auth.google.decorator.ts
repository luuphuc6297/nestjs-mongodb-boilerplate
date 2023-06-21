import { UseGuards, applyDecorators } from '@nestjs/common'
import { AuthGoogleOauth2LoginGuard, AuthGoogleOauth2SignUpGuard } from 'infrastructure/guards'

export function AuthGoogleOAuth2SignUpProtected(): MethodDecorator {
    return applyDecorators(UseGuards(AuthGoogleOauth2SignUpGuard))
}

export function AuthGoogleOAuth2LoginProtected(): MethodDecorator {
    return applyDecorators(UseGuards(AuthGoogleOauth2LoginGuard))
}
