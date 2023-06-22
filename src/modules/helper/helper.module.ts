import { Global, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { HelperArrayService } from 'modules/helper/services/helper.array.service'
import { HelperNumberService } from 'modules/helper/services/helper.number.service'
import { HelperDateService } from './services/helper.date.service'
import { HelperEncryptionService } from './services/helper.encryption.service'
import { HelperHashService } from './services/helper.hash.service'
import { HelperStringService } from './services/helper.string.service'

@Global()
@Module({
    providers: [
        HelperArrayService,
        HelperDateService,
        HelperEncryptionService,
        HelperHashService,
        HelperNumberService,
        HelperStringService,
        // HelperFileService,
    ],
    exports: [
        HelperArrayService,
        HelperDateService,
        HelperEncryptionService,
        HelperHashService,
        HelperNumberService,
        HelperStringService,
        // HelperFileService,
    ],
    controllers: [],
    imports: [
        JwtModule.registerAsync({
            inject: [ConfigService],
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                secret: configService.get<string>('helper.jwt.defaultSecretKey'),
                signOptions: {
                    expiresIn: configService.get<string>('helper.jwt.defaultExpirationTime'),
                },
            }),
        }),
    ],
})
export class HelperModule {}
