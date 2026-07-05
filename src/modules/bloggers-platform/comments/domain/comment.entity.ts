import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Model, Types } from "mongoose";
import { CreateDomainCommentDto } from "./dto/comment.domain-dto";
import { UpdateCommentInputDto } from "../api/dto/comments.input-dto";

@Schema({ _id: false })
export class CommentatorInfo {
    @Prop({ type: Types.ObjectId, required: true })
    userId: Types.ObjectId

    @Prop({ type: String, required: true })
    userLogin: string
}

export const CommentatorInfoSchema =
    SchemaFactory.createForClass(CommentatorInfo);

@Schema({ _id: false })
export class LikesInfo {
    @Prop({ type: Number, required: true, default: 0 })
    likesCount: number

    @Prop({ type: Number, required: true, default: 0 })
    dislikesCount: number
}

export const LikesInfoSchema = SchemaFactory.createForClass(LikesInfo)

@Schema({ timestamps: true })
export class Comment {

    @Prop({ type: Types.ObjectId, required: true })
    postId: Types.ObjectId

    @Prop({ type: String, required: true })
    content: string

    @Prop({ type: CommentatorInfo, required: true })
    commentatorInfo: CommentatorInfo

    @Prop({ type: LikesInfo, required: true })
    likesInfo: LikesInfo

    createdAt: Date
    updatedAt: Date

    @Prop({ type: Date, nullable: true, default: null })
    deletedAt: Date | null

    static createInstance(dto: CreateDomainCommentDto): CommentDocument {
        const comment = new this()
        comment.postId = dto.postId
        comment.content = dto.content
        comment.commentatorInfo = dto.commentatorInfo
        comment.likesInfo = {
            likesCount: 0,
            dislikesCount: 0
        }

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

    updateLikesCount(likesCount: number, dislikesCount: number) {
        this.likesInfo.likesCount += likesCount
        this.likesInfo.dislikesCount += dislikesCount
    }
}

export const CommentSchema = SchemaFactory.createForClass(Comment)
CommentSchema.loadClass(Comment)

export type CommentDocument = HydratedDocument<Comment>
export type CommentModelType = Model<CommentDocument> & typeof Comment