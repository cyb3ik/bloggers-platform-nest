import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';
import { PaginatedViewDto } from '../../../../../../core/dto/paginated.view-dto';
import { PostsQueryRepository } from '../../../../posts/infrastructure/posts.query.repository';
import { Types } from 'mongoose';
import { NotFoundException } from '@nestjs/common';
import { CommentsQueryRepository } from '../../../../comments/infrastructure/comments.query.repository';
import { CommentViewDto } from '../../../../comments/api/dto/comments.view-dto';
import { CommentsQueryParams } from '../../../../comments/api/dto/comments.query.params-dto';
import { LikesRepository } from '../../../../likes/repositories/likes-repository';
import { LikeStatus } from '../../../../likes/dto/create-domain-like.dto';

export class FindAllCommentsFromPostQuery extends Query<PaginatedViewDto<CommentViewDto[]>> {
    constructor(
        public readonly postId: Types.ObjectId,
        public readonly query: CommentsQueryParams,
        public readonly userId?: Types.ObjectId,
    ) {
        super()
    }
}

@QueryHandler(FindAllCommentsFromPostQuery)
export class FindAllCommentsFromPostQueryHandler implements IQueryHandler<FindAllCommentsFromPostQuery> {
    constructor(
        private readonly PostsQueryRepository: PostsQueryRepository,
        private readonly CommentsQueryRepository: CommentsQueryRepository,
        private readonly LikesRepository: LikesRepository,
    ) { }

    async execute(query: FindAllCommentsFromPostQuery): Promise<PaginatedViewDto<CommentViewDto[]>> {
        const post = await this.PostsQueryRepository.findPostById(query.postId)

        if (!post) {
            throw new NotFoundException('Post not found')
        }

        const { items, totalCount } = await this.CommentsQueryRepository.findAllCommentsFromPost(query.postId, query.query)

        const itemsWithStatuses = []

        if (query.userId.toString()) {
            for (const item of items) {
                const { status } = await this.LikesRepository.getUserLikeEntityAndStatus(item._id, query.userId)

                itemsWithStatuses.push(new CommentViewDto(item, status))

            }
        } else {
            for (const item of items) {
                itemsWithStatuses.push(new CommentViewDto(item, LikeStatus.None))
            }
        }


        return PaginatedViewDto.mapToView({
            items: itemsWithStatuses,
            page: query.query.pageNumber,
            size: query.query.pageSize,
            totalCount: totalCount
        })
    }
}