import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Model } from "mongoose";
import { CreateDomainBlogDto } from "./dto/blog.domain-dto";
import { UpdateBlogInputDto } from "../api/dto/blogs.input-dto";

@Schema({ timestamps: true })
export class Blog {

    @Prop({ type: String, required: true })
    name: string

    @Prop({ type: String, required: true })
    description: string

    @Prop({ type: String, required: true })
    websiteUrl: string

    @Prop({ type: Boolean, required: true })
    isMembership: boolean

    createdAt: Date
    updatedAt: Date

    @Prop({ type: Date, nullable: true, default: null })
    deletedAt: Date | null

    static createInstance(dto: CreateDomainBlogDto): BlogDocument {
        const blog = new this()
        blog.name = dto.name
        blog.description = dto.description
        blog.websiteUrl = dto.websiteUrl
        blog.isMembership = dto.isMembership

        return blog as BlogDocument
    }

    softDeleteSelf() {
        if (this.deletedAt !== null) {
            throw new Error('Entity already deleted');
        }
        this.deletedAt = new Date();
    }

    update(dto: UpdateBlogInputDto): void {
        this.name = dto.name
        this.description = dto.description
        this.websiteUrl = dto.websiteUrl
    }
}

export const BlogSchema = SchemaFactory.createForClass(Blog)
BlogSchema.loadClass(Blog)

export type BlogDocument = HydratedDocument<Blog>
export type BlogModelType = Model<BlogDocument> & typeof Blog