import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Model } from "mongoose";
import { CreateDomainUserDto } from "./dto/user.domain-dto";

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

        return user as UserDocument
    }

    makeDeleted() {
        if (this.deletedAt !== null) {
            throw new Error('Entity already deleted');
        }
        this.deletedAt = new Date();
    }
}

export const UserSchema = SchemaFactory.createForClass(User)
UserSchema.loadClass(User)

export type UserDocument = HydratedDocument<User>
export type UserModelType = Model<UserDocument> & typeof User



