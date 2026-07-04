import { CommandHandler, ICommandHandler } from "@nestjs/cqrs"
import { Types } from "mongoose"
import { ChangeLikeStatusInputDto } from "../../../../likes/dto/change-like-status-input.dto"
import { InjectModel } from "@nestjs/mongoose"
import { Comment, type CommentModelType } from "../../../domain/comment.entity"
import { CommentsRepository } from "../../../infrastructure/comments.repository"
import { Like, type LikeModelType } from "../../../../likes/domain/like.entity"
import { LikesRepository } from "../../../../likes/repositories/likes-repository"
import { NotFoundException } from "@nestjs/common"
import { UserInfo } from "../../../../../users/api/dto/user-info.dto"
import { LikeStatus } from "../../../../likes/dto/create-domain-like.dto"

export class ChangeLikeStatusOnCommentCommand {
    constructor(
        public readonly commentId: Types.ObjectId,
        public readonly user: UserInfo,
        public readonly dto: ChangeLikeStatusInputDto
    ) { }
}

@CommandHandler(ChangeLikeStatusOnCommentCommand)
export class ChangeLikeStatusOnCommentUseCase
    implements ICommandHandler<ChangeLikeStatusOnCommentCommand> {
    constructor(
        @InjectModel(Comment.name)
        private readonly CommentModel: CommentModelType,
        @InjectModel(Like.name)
        private readonly LikeModel: LikeModelType,
        private readonly LikesRepository: LikesRepository,
        private readonly CommentsRepository: CommentsRepository,
    ) { }

    async execute({ commentId, user, dto }: ChangeLikeStatusOnCommentCommand): Promise<void> {

        const comment = await this.CommentsRepository.findCommentById(commentId)

        if (!comment) {
            throw new NotFoundException('Comment not found')
        }

        const { status, like } = await this.LikesRepository.getUserLikeEntityAndStatus(commentId, user.id)

        if (!like) {

            if (dto.likeStatus === LikeStatus.None) {
                return
            }

            const newLike = this.LikeModel.createInstance(
                {
                    userId: user.id,
                    entityId: commentId,
                    userLogin: user.login,
                    status: dto.likeStatus
                }
            )

            await this.LikesRepository.save(newLike)

            switch (dto.likeStatus) {
                case (LikeStatus.Like):
                    comment.updateLikesCount(1, 0)
                    break
                case (LikeStatus.Dislike):
                    comment.updateLikesCount(0, 1)
                    break
            }

        } else {
            if (status === LikeStatus.Like) {
                switch (dto.likeStatus) {
                    case (LikeStatus.Dislike):
                        comment.updateLikesCount(-1, 1)
                        like.updateLikeStatus(dto.likeStatus)
                        break
                    case (LikeStatus.None):
                        comment.updateLikesCount(-1, 0)
                        like.updateLikeStatus(dto.likeStatus)
                        break
                }
            } else {
                switch (dto.likeStatus) {
                    case (LikeStatus.Like):
                        comment.updateLikesCount(1, -1)
                        like.updateLikeStatus(dto.likeStatus)
                        break
                    case (LikeStatus.None):
                        comment.updateLikesCount(0, -1)
                        like.updateLikeStatus(dto.likeStatus)
                        break
                }
            }
            await this.LikesRepository.save(like)
        }

        await this.CommentsRepository.save(comment)
    }
}