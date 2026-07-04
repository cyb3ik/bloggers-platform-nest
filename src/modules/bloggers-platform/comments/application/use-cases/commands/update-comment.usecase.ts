import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Types } from "mongoose";
import { ForbiddenException, NotFoundException } from "@nestjs/common";
import { CommentsRepository } from "../../../infrastructure/comments.repository";
import { UpdateCommentInputDto } from "../../../api/dto/comments.input-dto";


export class UpdateCommentCommand {
    constructor(
        public readonly commentId: Types.ObjectId,
        public readonly dto: UpdateCommentInputDto,
        public readonly userId: Types.ObjectId,
    ) { }
}

@CommandHandler(UpdateCommentCommand)
export class UpdateCommentUseCase
    implements ICommandHandler<UpdateCommentCommand> {
    constructor(
        private readonly CommentsRepository: CommentsRepository
    ) { }

    async execute({ commentId, dto, userId }: UpdateCommentCommand): Promise<void> {
        const comment = await this.CommentsRepository.findCommentById(commentId)

        if (!comment) {
            throw new NotFoundException('Comment was not found')
        }

        if (comment.commentatorInfo.userId.toString() !== userId.toString()) {
            throw new ForbiddenException()
        }

        comment.update(dto)

        await this.CommentsRepository.save(comment)
    }
}