import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Model } from "mongoose";

@Schema({ timestamps: false })
export class Request {
    @Prop({ type: String, required: true })
    ip: string

    @Prop({ type: String, required: true })
    url: string

    @Prop({ type: Date, required: true })
    date: Date

    static createInstance(dto: { ip: string, url: string, date: Date }): RequestDocument {
        const request = new this()

        request.ip = dto.ip
        request.url = dto.url
        request.date = dto.date

        return request as RequestDocument
    }
}

export const RequestSchema = SchemaFactory.createForClass(Request)
RequestSchema.loadClass(Request)

export type RequestDocument = HydratedDocument<Request>
export type RequestModelType = Model<RequestDocument> & typeof Request