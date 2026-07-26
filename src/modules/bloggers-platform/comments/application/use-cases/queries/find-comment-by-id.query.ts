import { Query } from '@nestjs/cqrs';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Types } from 'mongoose';
import { NotFoundException } from '@nestjs/common';
import { CommentViewDto } from '../../../api/dto/comments.view-dto';
import { LikesRepository } from '../../../../likes/repositories/likes-repository';
import { LikeStatus } from '../../../../likes/dto/create-domain-like.dto';
import { CommentsQueryRepository } from '../../../infrastructure/comments.query.repository';

export class FindCommentByIdQuery extends Query<CommentViewDto> {
    constructor(
        public readonly commentId: string,
        public readonly userId?: string,
    ) {
        super()
    }
}

@QueryHandler(FindCommentByIdQuery)
export class FindCommentByIdQueryHandler implements IQueryHandler<FindCommentByIdQuery> {
    constructor(
        private readonly CommentsQueryRepository: CommentsQueryRepository,
        private readonly LikesRepository: LikesRepository
    ) { }

    async execute(query: FindCommentByIdQuery): Promise<CommentViewDto> {
        const comment = await this.CommentsQueryRepository.getEntityById(
            query.commentId
        )

        if (!comment) {
            throw new NotFoundException('Comment not found')
        }

        let status = LikeStatus.None

        if (query.userId) {
            const like = await this.LikesRepository.findLikeByUserId(comment.id, query.userId)

            if (like) {
                status = like.status
            }
        }

        const { likesCount, dislikesCount } = await this.LikesRepository.getLikesAndDislikesCount(comment.id)

        comment.addLikesInfo(likesCount, dislikesCount, status)

        return comment
    }
}