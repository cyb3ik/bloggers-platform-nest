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
        public readonly postId: string,
        public readonly userId?: string
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
        const post = await this.PostsQueryRepository.getEntityById(
            query.postId
        )

        if (!post) {
            throw new NotFoundException('Post not found')
        }

        let status = LikeStatus.None

        if (query.userId) {
            const like = await this.LikesRepository.findLikeByUserId(post.id, query.userId)

            if (like) {
                status = like.status
            }
        }

        const { likesCount, dislikesCount } = await this.LikesRepository.getLikesAndDislikesCount(post.id)

        const newestLikes = await this.LikesRepository.getNewestLikesFromEntity(post.id)

        post.addLikesInfo(likesCount, dislikesCount, status, newestLikes)

        return post
    }
}