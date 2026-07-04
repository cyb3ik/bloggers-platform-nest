import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';
import { PaginatedViewDto } from '../../../../../../core/dto/paginated.view-dto';
import { PostsQueryRepository } from '../../../../posts/infrastructure/posts.query.repository';
import { Types } from 'mongoose';
import { NotFoundException } from '@nestjs/common';
import { CommentsQueryRepository } from '../../../../comments/infrastructure/comments.query.repository';
import { CommentViewDto } from '../../../../comments/api/dto/comments.view-dto';
import { CommentsQueryParams } from '../../../../comments/api/dto/comments.query.params-dto';

export class FindAllCommentsFromPostQuery extends Query<PaginatedViewDto<CommentViewDto[]>> {
    constructor(
        public readonly postId: Types.ObjectId,
        public readonly query: CommentsQueryParams
    ) {
        super()
    }
}

@QueryHandler(FindAllCommentsFromPostQuery)
export class FindAllCommentsFromPostQueryHandler implements IQueryHandler<FindAllCommentsFromPostQuery> {
    constructor(
        private readonly PostsQueryRepository: PostsQueryRepository,
        private readonly CommentsQueryRepository: CommentsQueryRepository,
    ) { }

    async execute(query: FindAllCommentsFromPostQuery): Promise<PaginatedViewDto<CommentViewDto[]>> {
        const post = await this.PostsQueryRepository.findPostById(query.postId)

        if (!post) {
            throw new NotFoundException('Post not found')
        }

        const comments = await this.CommentsQueryRepository.findAllCommentsFromPost(query.postId, query.query)

        return comments
    }
}