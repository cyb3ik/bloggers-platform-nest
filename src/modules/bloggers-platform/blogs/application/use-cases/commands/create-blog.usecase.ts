import { InjectModel } from "@nestjs/mongoose";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Types } from "mongoose";
import { CreateBlogInputDto } from "../../../api/dto/blogs.input-dto";
import { Blog, type BlogModelType } from "../../../domain/blog.entity";
import { BlogsRepository } from "../../../infrastructure/blogs.repository";


export class CreateBlogCommand {
    constructor(public readonly dto: CreateBlogInputDto) { }
}

@CommandHandler(CreateBlogCommand)
export class CreateBlogUseCase
    implements ICommandHandler<CreateBlogCommand> {
    constructor(
        @InjectModel(Blog.name)
        private readonly BlogModel: BlogModelType,
        private readonly BlogsRepository: BlogsRepository,
    ) { }

    async execute({ dto }: CreateBlogCommand): Promise<Types.ObjectId> {

        const blog = this.BlogModel.createInstance({
            name: dto.name,
            description: dto.description,
            websiteUrl: dto.websiteUrl,
            isMembership: false
        })

        await this.BlogsRepository.save(blog)

        return blog._id
    }
}