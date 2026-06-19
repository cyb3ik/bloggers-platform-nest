import { InjectModel } from '@nestjs/mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Post, PostDocument, type PostModelType } from '../domain/post.entity';
import { Types } from 'mongoose';


@Injectable()
export class PostsRepository {
    constructor(@InjectModel(Post.name) private readonly PostModel: PostModelType) { }

    async save(post: PostDocument) {
        await post.save()
    }

    async findPostByIdOrFail(id: string): Promise<PostDocument> {
        const post = await this.PostModel.findOne({
            _id: id,
            deletedAt: null,
        })

        if (!post) {
            //TODO: replace with domain exception
            throw new NotFoundException('Post not found')
        }

        return post
    }
}
