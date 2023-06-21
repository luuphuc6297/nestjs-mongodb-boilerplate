import { Prop, SchemaFactory } from '@nestjs/mongoose'
import { ENUM_USER_SIGN_UP_FROM } from 'constants/user/user.enum.constant'
import { DatabaseMongoUUIDEntityAbstract } from 'database/abstracts/mongodb/entities/database.mongo.uuid.entity.abstract'
import { RoleEntity } from 'domain/role/repositories/entities/role.entity'
import { DatabaseEntity } from 'infrastructure/decorators'
import { AwsS3Serialization } from 'infrastructure/serializations'
import { IUserGoogleEntity } from 'interfaces'
import { CallbackWithoutResultAndOptionalError, Document } from 'mongoose'

export const UserDatabaseName = 'users'

@DatabaseEntity({ collection: UserDatabaseName })
export class UserEntity extends DatabaseMongoUUIDEntityAbstract {
    @Prop({
        required: false,
        sparse: true,
        index: true,
        trim: true,
        type: String,
        unique: true,
        maxlength: 100,
    })
    username?: string

    @Prop({
        required: true,
        index: true,
        lowercase: true,
        trim: true,
        type: String,
        maxlength: 50,
    })
    firstName: string

    @Prop({
        required: true,
        index: true,
        lowercase: true,
        trim: true,
        type: String,
        maxlength: 50,
    })
    lastName: string

    @Prop({
        required: false,
        sparse: true,
        trim: true,
        unique: true,
        type: String,
        maxlength: 15,
    })
    mobileNumber?: string

    @Prop({
        required: true,
        index: true,
        unique: true,
        trim: true,
        lowercase: true,
        type: String,
        maxlength: 100,
    })
    email: string

    @Prop({
        required: true,
        ref: RoleEntity.name,
        index: true,
    })
    role: string

    @Prop({
        required: true,
        type: String,
    })
    password: string

    @Prop({
        required: true,
        type: Date,
    })
    passwordExpired: Date

    @Prop({
        required: true,
        type: Date,
    })
    passwordCreated: Date

    @Prop({
        required: true,
        default: 0,
        type: Number,
    })
    passwordAttempt: number

    @Prop({
        required: true,
        type: Date,
    })
    signUpDate: Date

    @Prop({
        required: true,
        enum: ENUM_USER_SIGN_UP_FROM,
    })
    signUpFrom: ENUM_USER_SIGN_UP_FROM

    @Prop({
        required: true,
        type: String,
    })
    salt: string

    @Prop({
        required: true,
        default: true,
        index: true,
        type: Boolean,
    })
    isActive: boolean

    @Prop({
        required: true,
        default: false,
        index: true,
        type: Boolean,
    })
    inactivePermanent: boolean

    @Prop({
        required: false,
        type: Date,
    })
    inactiveDate?: Date

    @Prop({
        required: true,
        default: false,
        index: true,
        type: Boolean,
    })
    blocked: boolean

    @Prop({
        required: false,
        type: Date,
    })
    blockedDate?: Date

    @Prop({
        required: false,
        _id: false,
        type: {
            path: String,
            pathWithFilename: String,
            filename: String,
            completedUrl: String,
            baseUrl: String,
            mime: String,
        },
    })
    photo?: AwsS3Serialization

    @Prop({
        required: false,
        _id: false,
        type: {
            accessToken: String,
            refreshToken: String,
        },
    })
    google?: IUserGoogleEntity
}

export const UserSchema = SchemaFactory.createForClass(UserEntity)

export type UserDoc = UserEntity & Document

UserSchema.pre('save', function (next: CallbackWithoutResultAndOptionalError) {
    this.email = this.email.toLowerCase()
    this.firstName = this.firstName.toLowerCase()
    this.lastName = this.lastName.toLowerCase()

    next()
})
