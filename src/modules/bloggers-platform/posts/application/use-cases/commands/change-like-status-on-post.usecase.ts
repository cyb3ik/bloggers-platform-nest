import { CommandHandler, ICommandHandler } from "@nestjs/cqrs"
import { ChangeLikeStatusInputDto } from "../../../../likes/dto/change-like-status-input.dto"
import { InjectModel } from "@nestjs/mongoose"
import { Like, type LikeModelType } from "../../../../likes/domain/like.entity"
import { LikesRepository } from "../../../../likes/repositories/likes-repository"
import { NotFoundException } from "@nestjs/common"
import { UserInfo } from "../../../../../users/api/dto/user-info.dto"
import { LikeStatus } from "../../../../likes/dto/create-domain-like.dto"
import { PostsRepository } from "../../../infrastructure/posts.repository"

export class ChangeLikeStatusOnPostCommand {
    constructor(
        public readonly postId: string,
        public readonly user: UserInfo,
        public readonly dto: ChangeLikeStatusInputDto
    ) { }
}

@CommandHandler(ChangeLikeStatusOnPostCommand)
export class ChangeLikeStatusOnPostUseCase
    implements ICommandHandler<ChangeLikeStatusOnPostCommand> {
    constructor(
        @InjectModel(Like.name)
        private readonly LikeModel: LikeModelType,
        private readonly LikesRepository: LikesRepository,
        private readonly PostsRepository: PostsRepository,
    ) { }

    async execute({ postId, user, dto }: ChangeLikeStatusOnPostCommand): Promise<void> {

        const post = await this.PostsRepository.findEntityById(postId)

        if (!post) {
            throw new NotFoundException('Post not found')
        }

        const like = await this.LikesRepository.findLikeByUserId(postId, user.id)

        if (!like) {

            if (dto.likeStatus === LikeStatus.None) {
                return
            }

            const newLike = this.LikeModel.createInstance(
                {
                    userId: user.id,
                    entityId: postId,
                    userLogin: user.login,
                    status: dto.likeStatus
                }
            )

            await this.LikesRepository.save(newLike)

        } else {
            if (like.status === LikeStatus.Like) {
                switch (dto.likeStatus) {
                    case (LikeStatus.Dislike):
                        like.updateLikeStatus(dto.likeStatus)
                        break
                    case (LikeStatus.None):
                        like.updateLikeStatus(dto.likeStatus)
                        break
                }
            } else {
                switch (dto.likeStatus) {
                    case (LikeStatus.Like):
                        like.updateLikeStatus(dto.likeStatus)
                        break
                    case (LikeStatus.None):
                        like.updateLikeStatus(dto.likeStatus)
                        break
                }
            }
            await this.LikesRepository.save(like)
        }

        await this.PostsRepository.save(post)
    }
}