import { registerAs } from '@nestjs/config'

export default registerAs(
    'database',
    (): Record<string, any> => ({
        host:
            process.env?.DATABASE_HOST ??
            'mongodb://localhost:27017,localhost:27018,localhost:27019',
        name: process.env?.DATABASE_NAME ?? 'nestjs-mongodb',
        user: process.env?.DATABASE_USER,
        password: process?.env.DATABASE_PASSWORD,
        debug: process.env.DATABASE_DEBUG === 'true',
        options: process.env?.DATABASE_OPTIONS,
    })
)
