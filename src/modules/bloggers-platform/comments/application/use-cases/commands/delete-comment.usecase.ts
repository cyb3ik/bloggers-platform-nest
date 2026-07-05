import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Types } from "mongoose";
import { ForbiddenException, NotFoundException } from "@nestjs/common";
import { CommentsRepository } from "../../../infrastructure/comments.repository";


export class DeleteCommentCommand {
    constructor(
        public readonly commentId: Types.ObjectId,
        public readonly userId: Types.ObjectId
    ) { }
}

@CommandHandler(DeleteCommentCommand)
export class DeleteCommentUseCase
    implements ICommandHandler<DeleteCommentCommand> {
    constructor(
        private readonly CommentsRepository: CommentsRepository
    ) { }

    async execute({ commentId, userId }: DeleteCommentCommand): Promise<void> {
        const comment = await this.CommentsRepository.findCommentById(commentId)

        if (!comment) {
            throw new NotFoundException('Comment was not found')
        }

        if (comment.commentatorInfo.userId.toString() !== userId.toString()) {
            throw new ForbiddenException()
        }

        await this.CommentsRepository.delete(comment)

        await this.CommentsRepository.save(comment)
    }
}