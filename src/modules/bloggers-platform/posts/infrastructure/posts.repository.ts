import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Post, PostDocument, type PostModelType } from '../domain/post.entity';
import { BaseRepository } from '../../../../core/interfaces/repositories/base-repository.interface';


@Injectable()
export class PostsRepository implements BaseRepository<PostDocument> {
    constructor(@InjectModel(Post.name) private readonly PostModel: PostModelType) { }

    async save(post: PostDocument) {
        await post.save()
    }

    async findEntityById(id: string): Promise<PostDocument | null> {
        const post = await this.PostModel.findOne({
            _id: id,
            deletedAt: null,
        })

        return post
    }
}
