import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Types } from "mongoose";
import { BlogsRepository } from "../../../infrastructure/blogs.repository";
import { NotFoundException } from "@nestjs/common";


export class DeleteBlogCommand {
    constructor(
        public readonly blogId: Types.ObjectId
    ) { }
}

@CommandHandler(DeleteBlogCommand)
export class DeleteBlogUseCase
    implements ICommandHandler<DeleteBlogCommand> {
    constructor(
        private readonly BlogsRepository: BlogsRepository,
    ) { }

    async execute({ blogId }: DeleteBlogCommand): Promise<void> {
        const blog = await this.BlogsRepository.findBlogById(blogId)

        if (!blog) {
            throw new NotFoundException('Blog was not found')
        }

        await this.BlogsRepository.delete(blog)

        await this.BlogsRepository.save(blog)
    }
}