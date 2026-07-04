import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import type { PostDocument, PostModelType } from "../domain/post.entity";
import { Post } from "../domain/post.entity";
import { PostsQueryParams } from "../api/dto/posts.query.params-dto";
import { Types } from "mongoose";


@Injectable()
export class PostsQueryRepository {
    constructor(@InjectModel(Post.name) private readonly PostModel: PostModelType) { }

    async findPostById(id: Types.ObjectId): Promise<PostDocument | null> {
        const post = await this.PostModel.findOne({
            _id: id,
            deletedAt: null,
        })

        return post
    }

    async findAllPosts(query: PostsQueryParams) {

        const { pageSize, sortBy, sortDirection } = query

        const skip = query.calculateSkip()

        const filter: any = { deletedAt: null }

        const result = await this.PostModel
            .find(filter)
            .sort({ [sortBy]: sortDirection })
            .skip(skip)
            .limit(pageSize)
            .exec()

        const totalCount = await this.PostModel.countDocuments(filter)

        return { items: result, totalCount: totalCount }
    }

    async findAllPostsFromBlog(blogId: Types.ObjectId, query: PostsQueryParams) {

        const { pageSize, sortBy, sortDirection } = query

        const skip = query.calculateSkip()

        const filter: any = { blogId: blogId, deletedAt: null }

        const result = await this.PostModel
            .find(filter)
            .sort({ [sortBy]: sortDirection })
            .skip(skip)
            .limit(pageSize)
            .exec()

        const totalCount = await this.PostModel.countDocuments(filter)

        return { items: result, totalCount: totalCount }
    }
}
