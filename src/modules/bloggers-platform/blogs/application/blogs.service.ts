import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Blog } from "../domain/blog.entity";
import type { BlogModelType } from "../domain/blog.entity";
import { CreateBlogInputDto, UpdateBlogInputDto } from "../api/dto/blogs.input-dto";
import { BlogsRepository } from "../infrastructure/blogs.repository";
import { Types } from "mongoose";

@Injectable()
export class BlogsService {
    constructor(
        @InjectModel(Blog.name)
        private readonly BlogModel: BlogModelType,
        private readonly BlogsRepository: BlogsRepository
    ) { }

    async createBlog(dto: CreateBlogInputDto): Promise<Types.ObjectId> {
        const blog = this.BlogModel.createInstance({
            name: dto.name,
            description: dto.description,
            websiteUrl: dto.websiteUrl,
            isMembership: false
        })

        await this.BlogsRepository.save(blog)

        return blog._id
    }

    async updateBlogById(id: Types.ObjectId, dto: UpdateBlogInputDto): Promise<void> {
        const blog = await this.BlogsRepository.findBlogByIdOrFail(id)

        blog.update(dto)

        await this.BlogsRepository.save(blog)
    }

    async deleteBlogById(id: Types.ObjectId): Promise<void> {
        const blog = await this.BlogsRepository.findBlogByIdOrFail(id)

        blog.softDeleteSelf()

        await this.BlogsRepository.save(blog)
    }
}