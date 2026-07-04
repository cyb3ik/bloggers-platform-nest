import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Types } from "mongoose";
import { NotFoundException } from "@nestjs/common";
import { CommentsRepository } from "../../../infrastructure/comments.repository";
import { UpdateCommentInputDto } from "../../../api/dto/comments.input-dto";


export class UpdateCommentCommand {
    constructor(
        public readonly commentId: Types.ObjectId,
        public readonly dto: UpdateCommentInputDto
    ) { }
}

@CommandHandler(UpdateCommentCommand)
export class UpdateCommentUseCase
    implements ICommandHandler<UpdateCommentCommand> {
    constructor(
        private readonly CommentsRepository: CommentsRepository
    ) { }

    async execute({ commentId, dto }: UpdateCommentCommand): Promise<void> {
        const comment = await this.CommentsRepository.findCommentById(commentId)

        if (!comment) {
            throw new NotFoundException('Comment was not found')
        }

        comment.update(dto)

        await this.CommentsRepository.save(comment)
    }
}