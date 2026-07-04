import { Query } from '@nestjs/cqrs';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Types } from 'mongoose';
import { NotFoundException } from '@nestjs/common';
import { CommentsQueryRepository } from '../../../infrastructure/comments.query.repository';
import { CommentViewDto } from '../../../api/dto/comments.view-dto';
import { LikesRepository } from '../../../../likes/repositories/likes-repository';
import { LikeStatus } from '../../../../likes/dto/create-like-input.dto';

export class FindCommentByIdQuery extends Query<CommentViewDto> {
    constructor(
        public readonly commentId: Types.ObjectId,
        public readonly userId?: Types.ObjectId,
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
        const comment = await this.CommentsQueryRepository.findCommentById(
            query.commentId
        )

        if (!comment) {
            throw new NotFoundException('Comment not found')
        }

        if (!query.userId) {
            return new CommentViewDto(comment, LikeStatus.None)
        }

        const likeStatus = await this.LikesRepository.getUserLikeStatus(query.commentId, query.userId)

        return new CommentViewDto(comment, likeStatus)
    }
}