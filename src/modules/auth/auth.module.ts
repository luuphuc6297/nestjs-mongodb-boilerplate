import { DynamicModule, Module, Provider } from '@nestjs/common'
import { AuthGoogleOAuth2LoginStrategy, AuthJwtRefreshStrategy } from 'infrastructure/guards'
import { AuthJwtAccessStrategy } from 'infrastructure/guards/jwt-access/auth.jwt-access.strategy'
import { AuthService } from './services/auth.services'

@Module({
    providers: [AuthService],
    exports: [AuthService],
    controllers: [],
    imports: [],
})
export class AuthModule {
    static forRoot(): DynamicModule {
        const providers: Provider<any>[] = [AuthJwtAccessStrategy, AuthJwtRefreshStrategy]

        if (process.env.SSO_GOOGLE_CLIENT_ID && process.env.SSO_GOOGLE_CLIENT_SECRET) {
            providers.push(AuthGoogleOAuth2LoginStrategy)
            providers.push(AuthGoogleOAuth2LoginStrategy)
        }

        return {
            module: AuthModule,
            providers,
            exports: [],
            controllers: [],
            imports: [],
        }
    }
}
