import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument } from '../domain/blog.entity';
import { Injectable } from '@nestjs/common';
import type { BlogModelType } from '../domain/blog.entity';

import { BaseRepository } from '../../../../core/interfaces/repositories/base-repository.interface';

@Injectable()
export class BlogsRepository implements BaseRepository<BlogDocument> {
    constructor(@InjectModel(Blog.name) private readonly BlogModel: BlogModelType) { }

    async save(blog: BlogDocument) {
        await blog.save()
    }

    async findEntityById(id: string): Promise<BlogDocument | null> {
        const blog = await this.BlogModel.findOne({
            _id: id,
            deletedAt: null,
        })

        return blog
    }
}
