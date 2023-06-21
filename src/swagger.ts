import { Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestApplication } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { ENUM_APP_ENVIRONMENT } from 'constants/app/app.enum.constant'
import { writeFileSync } from 'fs'
import {
    AwsS3MultipartPartsSerialization,
    AwsS3MultipartSerialization,
    AwsS3Serialization,
    ResponseDefaultSerialization,
    ResponsePagingSerialization,
} from 'infrastructure/serializations'
import { SwaggerTheme } from 'swagger-themes'

export default async function (app: NestApplication) {
    const configService = app.get(ConfigService)
    const env: string = configService.get<string>('app.env')
    const logger = new Logger()

    const docName: string = configService.get<string>('doc.name')
    const docDesc: string = configService.get<string>('doc.description')
    const docVersion: string = configService.get<string>('doc.version')
    const docPrefix: string = configService.get<string>('doc.prefix')

    if (env !== ENUM_APP_ENVIRONMENT.PRODUCTION) {
        const documentBuild = new DocumentBuilder()
            .setTitle(docName)
            .setDescription(docDesc)
            .setVersion(docVersion)
            .addTag("API's")
            .addServer('/')
            .addServer('/staging')
            .addServer('/prod')
            .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'accessToken')
            .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'refreshToken')
            .addApiKey({ type: 'apiKey', in: 'header', name: 'x-api-key' }, 'apiKey')
            .build()

        const document = SwaggerModule.createDocument(app, documentBuild, {
            deepScanRoutes: true,
            extraModels: [
                ResponseDefaultSerialization,
                ResponsePagingSerialization,
                AwsS3MultipartPartsSerialization,
                AwsS3MultipartSerialization,
                AwsS3Serialization,
            ],
        })

        writeFileSync('./data/swagger.json', JSON.stringify(document))
        const theme = new SwaggerTheme('v3')

        SwaggerModule.setup(docPrefix, app, document, {
            jsonDocumentUrl: `${docPrefix}/json`,
            yamlDocumentUrl: `${docPrefix}/yaml`,
            explorer: false,
            customSiteTitle: docName,
            customCss: theme.getBuffer('dark'),
            swaggerOptions: {
                docExpansion: 'none',
                persistAuthorization: true,
                displayOperationId: true,
                operationsSorter: 'alpha',
                tagsSorter: 'alpha',
                tryItOutEnabled: true,
                filter: true,
                deepLinking: true,
                syntaxHighlight: {
                    activate: true,
                    theme: 'tomorrow-night',
                },
            },
        })

        logger.log(`==========================================================`)

        logger.log(`Docs will serve on ${docPrefix}`, 'NestApplication')

        logger.log(`==========================================================`)
    }
}
