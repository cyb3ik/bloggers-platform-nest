import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Post, PostDocument, type PostModelType } from '../domain/post.entity';
import { Types } from 'mongoose';


@Injectable()
export class PostsRepository {
    constructor(@InjectModel(Post.name) private readonly PostModel: PostModelType) { }

    async save(post: PostDocument) {
        await post.save()
    }

    async delete(post: PostDocument) {
        post.softDeleteSelf()
    }

    async findPostById(id: Types.ObjectId): Promise<PostDocument | null> {
        const post = await this.PostModel.findOne({
            _id: id,
            deletedAt: null,
        })

        return post
    }
}
