import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument } from '../domain/blog.entity';
import { Injectable } from '@nestjs/common';
import type { BlogModelType } from '../domain/blog.entity';
import { Types } from 'mongoose';

@Injectable()
export class BlogsRepository {
    constructor(@InjectModel(Blog.name) private readonly BlogModel: BlogModelType) { }

    async save(blog: BlogDocument) {
        await blog.save()
    }

    async delete(blog: BlogDocument) {
        blog.softDeleteSelf()
    }

    async findBlogById(id: Types.ObjectId): Promise<BlogDocument | null> {
        const blog = await this.BlogModel.findOne({
            _id: id,
            deletedAt: null,
        })

        return blog
    }
}
