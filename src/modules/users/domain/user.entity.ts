import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Model } from "mongoose";
import { CreateDomainUserDto } from "./dto/user.domain-dto";
import { add } from "date-fns/add"

@Schema({ _id: false })
class EmailConfirmationInfo {
    @Prop({ type: String, required: false })
    confirmationCode?: string

    @Prop({ type: Date, required: false })
    expirationDate?: Date

    @Prop({ type: Boolean, required: true })
    isConfirmed: boolean
}

@Schema({ _id: false })
class PasswordRecoveryInfo {
    @Prop({ type: String, required: false })
    recoveryCode?: string

    @Prop({ type: Date, required: false })
    expirationDate?: Date
}

@Schema({ timestamps: true })
export class User {

    @Prop({ type: String, required: true })
    login: string

    @Prop({ type: String, required: true })
    passwordSalt: string

    @Prop({ type: String, required: true })
    passwordHash: string

    @Prop({ type: String, required: true })
    email: string

    @Prop({ type: EmailConfirmationInfo, required: true })
    emailConfirmation: EmailConfirmationInfo

    @Prop({ type: PasswordRecoveryInfo, required: false })
    passwordRecovery: PasswordRecoveryInfo

    createdAt: Date
    updatedAt: Date

    @Prop({ type: Date, nullable: true, default: null })
    deletedAt: Date | null

    static createInstance(dto: CreateDomainUserDto): UserDocument {
        const user = new this()
        user.email = dto.email
        user.passwordSalt = dto.passwordSalt
        user.passwordHash = dto.passwordHash
        user.login = dto.login
        user.emailConfirmation = {
            isConfirmed: false
        }

        return user as UserDocument
    }

    softDeleteSelf() {
        if (this.deletedAt !== null) {
            throw new Error('Entity already deleted');
        }
        this.deletedAt = new Date();
    }

    forbidPasswordRecovery() {
        this.passwordRecovery = null
    }

    setPasswordRecoveryCode(code: string) {
        this.passwordRecovery = {
            recoveryCode: code,
            expirationDate: add(new Date(), {
                hours: 2
            })
        }
    }

    setEmailConfirmationCode(code: string) {
        this.emailConfirmation.confirmationCode = code
        this.emailConfirmation.expirationDate = add(new Date(), {
            hours: 2
        })
    }

    setEmailConfirmationStatus(flag: boolean) {
        this.emailConfirmation.isConfirmed = flag
    }
}

export const UserSchema = SchemaFactory.createForClass(User)
UserSchema.loadClass(User)

export type UserDocument = HydratedDocument<User>
export type UserModelType = Model<UserDocument> & typeof User



