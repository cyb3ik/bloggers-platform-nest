import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Model } from "mongoose";
import { CreateDomainCommentDto } from "./dto/comment.domain-dto";

//TODO move to likes folder
export enum LikeStatus {
    None = 'None',
    Like = 'Like',
    Dislike = 'Dislike',
}

@Schema({ _id: false })
export class CommentatorInfo {
    @Prop({ type: String, required: true })
    userId: string

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

    @Prop({ type: String, required: true })
    postId: string

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

    makeDeleted() {
        if (this.deletedAt !== null) {
            throw new Error('Entity already deleted');
        }
        this.deletedAt = new Date();
    }
}

export const CommentSchema = SchemaFactory.createForClass(Comment)
CommentSchema.loadClass(Comment)

export type CommentDocument = HydratedDocument<Comment>
export type BlogModelType = Model<CommentDocument> & typeof Comment