import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Types } from "mongoose";
import { NotFoundException } from "@nestjs/common";
import { PostsRepository } from "../../../infrastructure/posts.repository";


export class DeletePostCommand {
    constructor(
        public readonly postId: Types.ObjectId
    ) { }
}

@CommandHandler(DeletePostCommand)
export class DeletePostUseCase
    implements ICommandHandler<DeletePostCommand> {
    constructor(
        private readonly PostsRepository: PostsRepository,
    ) { }

    async execute({ postId }: DeletePostCommand): Promise<void> {
        const post = await this.PostsRepository.findPostById(postId)

        if (!post) {
            throw new NotFoundException('Post was not found')
        }

        await this.PostsRepository.delete(post)

        await this.PostsRepository.save(post)
    }
}