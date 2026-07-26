import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Model, Types } from "mongoose";
import { CreateDomainCommentDto } from "./dto/comment.domain-dto";
import { UpdateCommentInputDto } from "../api/dto/comments.input-dto";

@Schema({ _id: false })
export class CommentatorInfo {
    @Prop({ type: String, required: true })
    userId: string

    @Prop({ type: String, required: true })
    userLogin: string
}

export const CommentatorInfoSchema =
    SchemaFactory.createForClass(CommentatorInfo);

@Schema({ timestamps: true })
export class Comment {

    @Prop({ type: String, required: true })
    postId: string

    @Prop({ type: String, required: true })
    content: string

    @Prop({ type: CommentatorInfo, required: true })
    commentatorInfo: CommentatorInfo

    createdAt: Date
    updatedAt: Date

    @Prop({ type: Date, nullable: true, default: null })
    deletedAt: Date | null

    static createInstance(dto: CreateDomainCommentDto): CommentDocument {
        const comment = new this()
        comment.postId = dto.postId
        comment.content = dto.content
        comment.commentatorInfo = dto.commentatorInfo

        return comment as CommentDocument
    }

    softDeleteSelf() {
        if (this.deletedAt !== null) {
            throw new Error('Entity already deleted');
        }
        this.deletedAt = new Date();
    }

    update(dto: UpdateCommentInputDto) {
        this.content = dto.content
    }
}

export const CommentSchema = SchemaFactory.createForClass(Comment)
CommentSchema.loadClass(Comment)

export type CommentDocument = HydratedDocument<Comment>
export type CommentModelType = Model<CommentDocument> & typeof Comment