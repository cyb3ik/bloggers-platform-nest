import { Query } from '@nestjs/cqrs';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Types } from 'mongoose';
import { NotFoundException } from '@nestjs/common';
import { PostsQueryRepository } from '../../../infrastructure/posts.query.repository';
import { PostViewDto } from '../../../api/dto/posts.view-dto';

export class FindPostByIdQuery extends Query<PostViewDto> {
    constructor(
        public readonly postId: Types.ObjectId
    ) {
        super()
    }
}

@QueryHandler(FindPostByIdQuery)
export class FindPostByIdQueryHandler implements IQueryHandler<FindPostByIdQuery> {
    constructor(
        private readonly PostsQueryRepository: PostsQueryRepository) { }

    async execute(query: FindPostByIdQuery): Promise<PostViewDto> {
        const post = await this.PostsQueryRepository.findPostById(
            query.postId
        )

        if (!post) {
            throw new NotFoundException('Post not found')
        }

        return post
    }
}