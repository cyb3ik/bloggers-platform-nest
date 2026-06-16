import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Post, type PostModelType } from "../domain/post.entity";
import { CreatePostForBlogInputDto, CreatePostInputDto, UpdatePostInputDto } from "../api/dto/posts.input-dto";
import { BlogsRepository } from "../../blogs/infrastructure/blogs.repository";
import { PostsRepository } from "../infrastructure/posts.repository";


@Injectable()
export class PostsService {
    constructor(
        @InjectModel(Post.name)
        private readonly PostModel: PostModelType,
        private readonly PostsRepository: PostsRepository,
        private readonly BlogsRepository: BlogsRepository
    ) { }

    async createPost(dto: CreatePostInputDto): Promise<string> {
        const blog = await this.BlogsRepository.findBlogByIdOrFail(dto.blogId)

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

    async createPostForBlog(dto: CreatePostForBlogInputDto, blogId: string): Promise<string> {
        const blog = await this.BlogsRepository.findBlogByIdOrFail(blogId)

        const post = this.PostModel.createInstance({
            title: dto.title,
            shortDescription: dto.shortDescription,
            content: dto.content,
            blogId: blogId,
            blogName: blog.name
        })

        await this.PostsRepository.save(post)

        return post._id.toString()
    }

    async updatePostById(id: string, dto: UpdatePostInputDto): Promise<void> {
        const blog = await this.BlogsRepository.findBlogByIdOrFail(dto.blogId)

        const post = await this.PostsRepository.findPostByIdOrFail(id)

        post.update({
            ...dto,
            blogName: blog.name
        })

        await this.PostsRepository.save(post)
    }

    async deletePostById(id: string): Promise<void> {
        const post = await this.PostsRepository.findPostByIdOrFail(id)

        post.softDeleteSelf()

        await this.PostsRepository.save(post)
    }
}