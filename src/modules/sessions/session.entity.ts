import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Model } from "mongoose";
import { CreateSessionDto } from "./dto/create-session.dto";

@Schema({ timestamps: false })
export class Session {
    @Prop({ type: String, required: true })
    ip: string

    @Prop({ type: String, required: true })
    title: string

    @Prop({ type: Number, required: true })
    lastActiveDate: number

    @Prop({ type: String, required: true })
    deviceId: string

    @Prop({ type: String, required: true })
    userId: string

    @Prop({ type: Number, required: true })
    exp: number

    static createInstance(dto: CreateSessionDto): SessionDocument {
        const session = new this()

        session.ip = dto.ip
        session.title = dto.title
        session.lastActiveDate = dto.lastActiveDate
        session.deviceId = dto.deviceId
        session.userId = dto.userId
        session.exp = dto.exp

        return session as SessionDocument
    }
}

export const SessionSchema = SchemaFactory.createForClass(Session)
SessionSchema.loadClass(Session)

export type SessionDocument = HydratedDocument<Session>
export type SessionModelType = Model<SessionDocument> & typeof Session