import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import type { PostDocument, PostModelType } from "../domain/post.entity";
import { Post } from "../domain/post.entity";
import { PostsQueryParams } from "../api/dto/posts.query.params-dto";
import { Types } from "mongoose";
import { IPostsQueryRepository } from "../../../../core/interfaces/repositories/posts/posts-query-repository.interface";
import { PaginatedViewDto } from "../../../../core/dto/paginated.view-dto";
import { PostViewDto } from "../api/dto/posts.view-dto";


@Injectable()
export class PostsQueryRepository implements IPostsQueryRepository {
    constructor(@InjectModel(Post.name) private readonly PostModel: PostModelType) { }

    async getEntityById(id: string): Promise<PostViewDto | null> {
        const post = await this.PostModel.findOne({
            _id: id,
            deletedAt: null,
        })

        return new PostViewDto(post)
    }

    async getAllEntities(query: PostsQueryParams) {

        const { pageSize, sortBy, sortDirection, pageNumber } = query

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

    async getAllPostsFromBlog(blogId: string, query: PostsQueryParams) {

        const { pageSize, sortBy, sortDirection, pageNumber } = query

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
