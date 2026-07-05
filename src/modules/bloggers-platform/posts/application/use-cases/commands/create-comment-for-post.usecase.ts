import { InjectModel } from "@nestjs/mongoose";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Types } from "mongoose";
import { PostsRepository } from "../../../../posts/infrastructure/posts.repository";
import { NotFoundException } from "@nestjs/common";
import { Comment, type CommentModelType } from "../../../../comments/domain/comment.entity";
import { CommentsRepository } from "../../../../comments/infrastructure/comments.repository";
import { CreateCommentInputDto } from "../../../../comments/api/dto/comments.input-dto";
import { UserInfo } from "../../../../../users/api/dto/user-info.dto";


export class CreateCommentForPostCommand {
    constructor(
        public readonly postId: Types.ObjectId,
        public readonly user: UserInfo,
        public readonly dto: CreateCommentInputDto
    ) { }
}

@CommandHandler(CreateCommentForPostCommand)
export class CreateCommentForPostUseCase
    implements ICommandHandler<CreateCommentForPostCommand> {
    constructor(
        @InjectModel(Comment.name)
        private readonly CommentModel: CommentModelType,
        private readonly CommentsRepository: CommentsRepository,
        private readonly PostsRepository: PostsRepository,
    ) { }

    async execute({ postId, user, dto }: CreateCommentForPostCommand): Promise<Types.ObjectId> {

        const post = await this.PostsRepository.findPostById(postId)

        if (!post) {
            throw new NotFoundException('Post not found')
        }

        const comment = this.CommentModel.createInstance({
            content: dto.content,
            commentatorInfo: {
                userId: user.id,
                userLogin: user.login
            },
            postId: postId
        })

        await this.CommentsRepository.save(comment)

        return comment._id
    }
}