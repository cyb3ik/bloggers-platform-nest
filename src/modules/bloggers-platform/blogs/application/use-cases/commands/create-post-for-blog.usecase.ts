import { InjectModel } from "@nestjs/mongoose";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Types } from "mongoose";
import { BlogsRepository } from "../../../infrastructure/blogs.repository";
import { CreatePostInputDto } from "../../../../posts/api/dto/posts.input-dto";
import { Post, type PostModelType } from "../../../../posts/domain/post.entity";
import { PostsRepository } from "../../../../posts/infrastructure/posts.repository";
import { NotFoundException } from "@nestjs/common";


export class CreatePostForBlogCommand {
    constructor(
        public readonly blogId: Types.ObjectId,
        public readonly dto: CreatePostInputDto
    ) { }
}

@CommandHandler(CreatePostForBlogCommand)
export class CreatePostForBlogUseCase
    implements ICommandHandler<CreatePostForBlogCommand> {
    constructor(
        @InjectModel(Post.name)
        private readonly PostModel: PostModelType,
        private readonly BlogsRepository: BlogsRepository,
        private readonly PostsRepository: PostsRepository,
    ) { }

    async execute({ blogId, dto }: CreatePostForBlogCommand): Promise<Types.ObjectId> {

        const blog = await this.BlogsRepository.findBlogById(blogId)

        if (!blog) {
            throw new NotFoundException('Blog not found')
        }

        const post = this.PostModel.createInstance({
            title: dto.title,
            shortDescription: dto.shortDescription,
            content: dto.content,
            blogId: blogId.toString(),
            blogName: blog.name
        })

        await this.PostsRepository.save(post)

        return post._id
    }
}