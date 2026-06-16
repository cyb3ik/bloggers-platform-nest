import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import type { PostModelType } from "../domain/post.entity";
import { PaginatedViewDto } from "../../../../core/dto/paginated.view-dto";
import { Post } from "../domain/post.entity";
import { PostViewDto } from "../api/dto/posts.view-dto";
import { PostsQueryParams } from "../api/dto/posts.query.params-dto";


@Injectable()
export class PostsQueryRepository {
    constructor(@InjectModel(Post.name) private readonly PostModel: PostModelType) { }

    async findPostByIdOrFail(id: string): Promise<PostViewDto> {
        const post = await this.PostModel.findOne({
            _id: id,
            deletedAt: null,
        })

        if (!post) {
            throw new NotFoundException('Blog not found')
        }

        return new PostViewDto(post)
    }

    async findAllPosts(query: PostsQueryParams): Promise<PaginatedViewDto<PostViewDto[]>> {

        const { pageNumber, pageSize, sortBy, sortDirection } = query

        const skip = query.calculateSkip()

        const filter: any = { deletedAt: null }

        const result = await this.PostModel
            .find(filter)
            .sort({ [sortBy]: sortDirection })
            .skip(skip)
            .limit(pageSize)
            .exec()

        const totalCount = await this.PostModel.countDocuments(filter)

        return PaginatedViewDto.mapToView({
            items: result.map(post => new PostViewDto(post)),
            page: pageNumber,
            size: pageSize,
            totalCount: totalCount
        })
    }

    async findAllPostsFromBlog(blogId: string, query: PostsQueryParams): Promise<PaginatedViewDto<PostViewDto[]>> {

        const { pageNumber, pageSize, sortBy, sortDirection } = query

        const skip = query.calculateSkip()

        const filter: any = { blogId: blogId, deletedAt: null }

        const result = await this.PostModel
            .find(filter)
            .sort({ [sortBy]: sortDirection })
            .skip(skip)
            .limit(pageSize)
            .exec()

        const totalCount = await this.PostModel.countDocuments(filter)

        return PaginatedViewDto.mapToView({
            items: result.map(post => new PostViewDto(post)),
            page: pageNumber,
            size: pageSize,
            totalCount: totalCount
        })
    }
}
