import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Types } from "mongoose";
import { NotFoundException } from "@nestjs/common";
import { CommentsRepository } from "../../../infrastructure/comments.repository";


export class DeleteCommentCommand {
    constructor(
        public readonly commentId: Types.ObjectId
    ) { }
}

@CommandHandler(DeleteCommentCommand)
export class DeleteCommentUseCase
    implements ICommandHandler<DeleteCommentCommand> {
    constructor(
        private readonly CommentsRepository: CommentsRepository
    ) { }

    async execute({ commentId }: DeleteCommentCommand): Promise<void> {
        const comment = await this.CommentsRepository.findCommentById(commentId)

        if (!comment) {
            throw new NotFoundException('Comment was not found')
        }

        await this.CommentsRepository.delete(comment)

        await this.CommentsRepository.save(comment)
    }
}