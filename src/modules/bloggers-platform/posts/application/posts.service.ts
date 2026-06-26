import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Post, type PostModelType } from "../domain/post.entity";
import { CreatePostForBlogInputDto, CreatePostInputDto, UpdatePostInputDto } from "../api/dto/posts.input-dto";
import { BlogsRepository } from "../../blogs/infrastructure/blogs.repository";
import { PostsRepository } from "../infrastructure/posts.repository";
import { Types } from "mongoose";


@Injectable()
export class PostsService {
    constructor(
        @InjectModel(Post.name)
        private readonly PostModel: PostModelType,
        private readonly PostsRepository: PostsRepository,
        private readonly BlogsRepository: BlogsRepository
    ) { }

    async createPost(dto: CreatePostInputDto): Promise<string> {
        const blog = await this.BlogsRepository.findBlogByIdOrFail(new Types.ObjectId(dto.blogId))

        const post = this.PostModel.createInstance({
            title: dto.title,
            shortDescription: dto.shortDescription,
            content: dto.content,
            blogId: dto.blogId,
            blogName: blog.name
        })

        await this.PostsRepository.save(post)

        return post._id.toString()
    }

    async createPostForBlog(dto: CreatePostForBlogInputDto, blogId: Types.ObjectId): Promise<Types.ObjectId> {
        const blog = await this.BlogsRepository.findBlogByIdOrFail(blogId)

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

    async updatePostById(id: Types.ObjectId, dto: UpdatePostInputDto): Promise<void> {
        const blog = await this.BlogsRepository.findBlogByIdOrFail(new Types.ObjectId(dto.blogId))

        const post = await this.PostsRepository.findPostByIdOrFail(id)

        post.update({
            ...dto,
            blogName: blog.name
        })

        await this.PostsRepository.save(post)
    }

    async deletePostById(id: Types.ObjectId): Promise<void> {
        const post = await this.PostsRepository.findPostByIdOrFail(id)

        post.softDeleteSelf()

        await this.PostsRepository.save(post)
    }
}