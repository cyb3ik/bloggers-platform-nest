import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { LikesInfo } from "../../comments/domain/comment.entity";
import { CreateDomainPostDto } from "./dto/posts.domain-dto";
import { HydratedDocument, Model } from "mongoose";

@Schema({ timestamps: true })
export class Post {
    @Prop({ type: String, required: true })
    title: string

    @Prop({ type: String, required: true })
    shortDescription: string

    @Prop({ type: String, required: true })
    content: string

    @Prop({ type: String, required: true })
    blogId: string

    @Prop({ type: String, required: true })
    blogName: string

    @Prop({ type: LikesInfo, required: true })
    likesInfo: LikesInfo

    createdAt: Date
    updatedAt: Date

    @Prop({ type: Date, nullable: true, default: null })
    deletedAt: Date | null

    static createInstance(dto: CreateDomainPostDto): PostDocument {
        const post = new this()
        post.title = dto.title
        post.shortDescription = dto.shortDescription
        post.content = dto.content
        post.blogId = dto.blogId
        post.blogName = dto.blogName
        post.likesInfo = {
            likesCount: 0,
            dislikesCount: 0
        }

        return post as PostDocument
    }

    makeDeleted() {
        if (this.deletedAt !== null) {
            throw new Error('Entity already deleted');
        }
        this.deletedAt = new Date();
    }
}

export const PostSchema = SchemaFactory.createForClass(Post)
PostSchema.loadClass(Post)

export type PostDocument = HydratedDocument<Post>
export type PostModelType = Model<PostDocument> & typeof Post