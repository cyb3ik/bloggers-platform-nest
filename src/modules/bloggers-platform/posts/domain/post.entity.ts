import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { LikesInfo } from "../../comments/domain/comment.entity";
import { CreateDomainPostDto } from "./dto/posts.domain-dto";
import { HydratedDocument, Model } from "mongoose";
import { UpdatePostInputDto } from "../api/dto/posts.input-dto";

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

    softDeleteSelf() {
        if (this.deletedAt !== null) {
            throw new Error('Entity already deleted')
        }
        this.deletedAt = new Date()
    }

    update(dto: UpdatePostInputDto & { blogName: string }): void {
        this.title = dto.title
        this.shortDescription = dto.shortDescription
        this.content = dto.content
        this.blogId = dto.blogId
        this.blogName = dto.blogName
    }
}

export const PostSchema = SchemaFactory.createForClass(Post)
PostSchema.loadClass(Post)

export type PostDocument = HydratedDocument<Post>
export type PostModelType = Model<PostDocument> & typeof Post