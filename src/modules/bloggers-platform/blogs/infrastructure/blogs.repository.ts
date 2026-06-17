import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument } from '../domain/blog.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import type { BlogModelType } from '../domain/blog.entity';
import { Types } from 'mongoose';

@Injectable()
export class BlogsRepository {
    constructor(@InjectModel(Blog.name) private readonly BlogModel: BlogModelType) { }

    async save(blog: BlogDocument) {
        await blog.save()
    }

    async findBlogByIdOrFail(id: string): Promise<BlogDocument> {
        if (!Types.ObjectId.isValid(id)) {
            throw new NotFoundException('Blog not found')
        }
        const blog = await this.BlogModel.findOne({
            _id: id,
            deletedAt: null,
        })

        if (!blog) {
            //TODO: replace with domain exception
            throw new NotFoundException('Blog not found')
        }

        return blog
    }
}
