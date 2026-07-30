import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';
import { PaginatedViewDto } from '../../../../../../core/dto/paginated.view-dto';
import { NotFoundException } from '@nestjs/common';
import { CommentsQueryRepository } from '../../../../comments/infrastructure/comments.query.repository';
import { CommentViewDto } from '../../../../comments/api/dto/comments.view-dto';
import { CommentsQueryParams } from '../../../../comments/api/dto/comments.query.params-dto';
import { LikesRepository } from '../../../../likes/repositories/likes-repository';
import { PostsRepository } from '../../../infrastructure/posts.repository';
import { LikeStatus } from '../../../../likes/dto/like.raw-dto';

export class FindAllCommentsFromPostQuery extends Query<PaginatedViewDto<CommentViewDto[]>> {
    constructor(
        public readonly postId: string,
        public readonly query: CommentsQueryParams,
        public readonly userId?: string,
    ) {
        super()
    }
}

@QueryHandler(FindAllCommentsFromPostQuery)
export class FindAllCommentsFromPostQueryHandler implements IQueryHandler<FindAllCommentsFromPostQuery> {
    constructor(
        private readonly PostsRepository: PostsRepository,
        private readonly CommentsQueryRepository: CommentsQueryRepository,
        private readonly LikesRepository: LikesRepository,
    ) { }

    async execute(query: FindAllCommentsFromPostQuery): Promise<PaginatedViewDto<CommentViewDto[]>> {
        const post = await this.PostsRepository.findEntityById(query.postId)

        if (!post) {
            throw new NotFoundException('Post not found')
        }

        const result = await this.CommentsQueryRepository.getAllCommentsFromPost(query.postId, query.query)

        for (const item of result.items) {
            let status = LikeStatus.None

            if (query.userId) {
                const like = await this.LikesRepository.findLikeByUserId(item.id, query.userId)

                if (like) {
                    status = like.status
                }
            }

            const { likesCount, dislikesCount } = await this.LikesRepository.getLikesAndDislikesCount(item.id)

            item.addLikesInfo(likesCount, dislikesCount, status)
        }

        return result
    }
}