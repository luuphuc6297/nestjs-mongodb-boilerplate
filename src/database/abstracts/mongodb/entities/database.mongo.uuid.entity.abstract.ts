import { Prop } from '@nestjs/mongoose'
import {
    DATABASE_CREATED_AT_FIELD_NAME,
    DATABASE_DELETED_AT_FIELD_NAME,
    DATABASE_UPDATED_AT_FIELD_NAME,
} from 'constants/database/database.constant'
import { DatabaseDefaultUUID } from 'constants/database/database.function.constant'
import { DatabaseBaseEntityAbstract } from 'database/abstracts/database.base-entity.abstract'

export abstract class DatabaseMongoUUIDEntityAbstract extends DatabaseBaseEntityAbstract<string> {
    @Prop({
        type: String,
        default: DatabaseDefaultUUID,
    })
    _id: string;

    @Prop({
        required: false,
        index: true,
        type: Date,
    })
    [DATABASE_DELETED_AT_FIELD_NAME]?: Date;

    @Prop({
        required: false,
        index: 'asc',
        type: Date,
    })
    [DATABASE_CREATED_AT_FIELD_NAME]?: Date;

    @Prop({
        required: false,
        index: 'desc',
        type: Date,
    })
    [DATABASE_UPDATED_AT_FIELD_NAME]?: Date
}
