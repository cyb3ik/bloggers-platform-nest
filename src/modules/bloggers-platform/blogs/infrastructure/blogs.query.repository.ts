import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Blog } from "../domain/blog.entity";
import type { BlogModelType } from "../domain/blog.entity";
import { BlogViewDto } from "../api/dto/blogs.view-dto";
import { BlogsQueryParams } from "../api/dto/blogs.query.params-dto";
import { PaginatedViewDto } from "../../../../core/dto/paginated.view-dto";
import { Types } from "mongoose";


@Injectable()
export class BlogsQueryRepository {
    constructor(@InjectModel(Blog.name) private readonly BlogModel: BlogModelType) { }

    async findBlogByIdOrFail(id: Types.ObjectId): Promise<BlogViewDto> {
        const blog = await this.BlogModel.findOne({
            _id: id,
            deletedAt: null,
        })

        if (!blog) {
            throw new NotFoundException('Blog not found')
        }

        return new BlogViewDto(blog)
    }

    async findAllBlogs(query: BlogsQueryParams): Promise<PaginatedViewDto<BlogViewDto[]>> {

        const { pageNumber, pageSize, sortBy, sortDirection, searchNameTerm } = query

        const skip = query.calculateSkip()

        const filter: any = { deletedAt: null }
        filter.$or = []

        if (searchNameTerm) {
            filter.$or.push({ name: { $regex: searchNameTerm, $options: 'i' } })
        }

        const result = await this.BlogModel
            .find(filter)
            .sort({ [sortBy]: sortDirection })
            .skip(skip)
            .limit(pageSize)
            .exec()

        const totalCount = await this.BlogModel.countDocuments(filter)

        return PaginatedViewDto.mapToView({
            items: result.map(blog => new BlogViewDto(blog)),
            page: pageNumber,
            size: pageSize,
            totalCount: totalCount
        })
    }
}
