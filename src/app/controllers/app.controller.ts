import { Controller, VERSION_NEUTRAL } from '@nestjs/common'

@Controller({
    version: VERSION_NEUTRAL,
    path: '/',
})
export class AppController {}
