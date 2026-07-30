import { InjectModel } from "@nestjs/mongoose";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { BlogsRepository } from "../../../infrastructure/blogs.repository";
import { CreatePostForBlogInputDto } from "../../../../posts/api/dto/posts.input-dto";
import { Post, type PostModelType } from "../../../../posts/domain/post.entity";
import { PostsRepository } from "../../../../posts/infrastructure/posts.repository";
import { NotFoundException } from "@nestjs/common";


export class CreatePostForBlogCommand {
    constructor(
        public readonly blogId: string,
        public readonly dto: CreatePostForBlogInputDto
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

    async execute({ blogId, dto }: CreatePostForBlogCommand): Promise<string> {

        const blog = await this.BlogsRepository.findEntityById(blogId)

        if (!blog) {
            throw new NotFoundException('Blog not found')
        }

        const blogData = blog.getPersistenceData()

        const post = this.PostModel.createInstance({
            title: dto.title,
            shortDescription: dto.shortDescription,
            content: dto.content,
            blogId: blogId,
            blogName: blogData.name
        })

        await this.PostsRepository.save(post)

        return post._id.toString()
    }
}