import { Query } from '@nestjs/cqrs';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Types } from 'mongoose';
import { NotFoundException } from '@nestjs/common';
import { PostsQueryRepository } from '../../../infrastructure/posts.query.repository';
import { PostViewDto } from '../../../api/dto/posts.view-dto';
import { LikesRepository } from '../../../../likes/repositories/likes-repository';
import { LikeStatus } from '../../../../likes/dto/create-domain-like.dto';

export class FindPostByIdQuery extends Query<PostViewDto> {
    constructor(
        public readonly postId: Types.ObjectId,
        public readonly userId?: Types.ObjectId
    ) {
        super()
    }
}

@QueryHandler(FindPostByIdQuery)
export class FindPostByIdQueryHandler implements IQueryHandler<FindPostByIdQuery> {
    constructor(
        private readonly PostsQueryRepository: PostsQueryRepository,
        private readonly LikesRepository: LikesRepository
    ) { }

    async execute(query: FindPostByIdQuery): Promise<PostViewDto> {
        const post = await this.PostsQueryRepository.findPostById(
            query.postId
        )

        if (!post) {
            throw new NotFoundException('Post not found')
        }

        const newestLikes = await this.LikesRepository.getNewestLikesFromEntity(query.postId)

        if (!query.userId) {
            return new PostViewDto(post, LikeStatus.None, newestLikes)
        }

        const { status } = await this.LikesRepository.getUserLikeEntityAndStatus(query.postId, query.userId)

        return new PostViewDto(post, status, newestLikes)
    }
}