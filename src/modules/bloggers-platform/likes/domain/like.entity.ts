import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Model, Types } from "mongoose";
import { CreateLikeInputDto, LikeStatus } from "../dto/create-like-input.dto";

@Schema({ timestamps: true })
export class Like {
    @Prop({ type: Types.ObjectId, required: true })
    userId: Types.ObjectId

    @Prop({ type: Types.ObjectId, required: true })
    entityId: Types.ObjectId

    @Prop({ type: String, required: true })
    userLogin: string

    @Prop({ type: String, enum: LikeStatus, required: true })
    status: LikeStatus

    createdAt: Date
    updatedAt: Date

    @Prop({ type: Date, nullable: true, default: null })
    deletedAt: Date | null

    static createInstance(dto: CreateLikeInputDto): LikeDocument {
        const like = new this()
        like.userId = dto.userId
        like.entityId = dto.entityId
        like.userLogin = dto.userLogin
        like.status = dto.status

        return like as LikeDocument
    }

    updateLikeStatus(status: LikeStatus) {
        this.status = status
    }

    softDeleteSelf() {
        if (this.deletedAt !== null) {
            throw new Error('Entity already deleted');
        }
        this.deletedAt = new Date();
    }
}

export const LikeSchema = SchemaFactory.createForClass(Like)
LikeSchema.loadClass(Like)

export type LikeDocument = HydratedDocument<Like>
export type LikeModelType = Model<LikeDocument> & typeof Like