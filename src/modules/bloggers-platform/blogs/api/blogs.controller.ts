import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query } from "@nestjs/common";
import { BlogsQueryParams } from "./dto/blogs.query.params-dto";
import { PostsQueryParams } from "../../posts/api/dto/posts.query.params-dto";
import { CreateBlogInputDto, UpdateBlogInputDto } from "./dto/blogs.input-dto";
import { CreatePostForBlogInputDto } from "../../posts/api/dto/posts.input-dto";
import { BlogsService } from "../application/blogs.service";
import { BlogsQueryRepository } from "../infrastructure/blogs.query.repository";
import { PostsService } from "../../posts/application/posts.service";
import { PostsQueryRepository } from "../../posts/infrastructure/posts.query.repository";

@Controller('blogs')
export class BlogsController {
    constructor(
        private readonly BlogsService: BlogsService,
        private readonly BlogsQueryRepository: BlogsQueryRepository,
        private readonly PostsService: PostsService,
        private readonly PostsQueryRepository: PostsQueryRepository
    ) { }

    @Get()
    @HttpCode(HttpStatus.OK)
    async findAllBlogs(@Query() query: BlogsQueryParams) {
        return this.BlogsQueryRepository.findAllBlogs(query)
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    async findBlogById(@Param('id') id: string) {
        return this.BlogsQueryRepository.findBlogByIdOrFail(id)
    }

    @Get(':blogId/posts')
    @HttpCode(HttpStatus.OK)
    async findAllPostsFromBlog(
        @Param('blogId') blogId: string,
        @Query() query: PostsQueryParams) {
        // TOCHECK спросить как лучше такое реализовать - в квери сервисе или оставить как есть
        await this.BlogsQueryRepository.findBlogByIdOrFail(blogId)

        return this.PostsQueryRepository.findAllPostsFromBlog(blogId, query)
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async createBlog(@Body() dto: CreateBlogInputDto) {
        const createdBlogId = await this.BlogsService.createBlog(dto)

        return this.BlogsQueryRepository.findBlogByIdOrFail(createdBlogId)
    }

    @Post(':blogId/posts')
    @HttpCode(HttpStatus.CREATED)
    async createPostForBlog(
        @Param('blogId') blogId: string,
        @Body() dto: CreatePostForBlogInputDto) {

        const createdPostId = await this.PostsService.createPostForBlog(dto, blogId)

        return this.PostsQueryRepository.findPostByIdOrFail(createdPostId)
    }

    @Put(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async updateBlogById(
        @Param('id') id: string,
        @Body() dto: UpdateBlogInputDto) {

        return this.BlogsService.updateBlogById(id, dto)
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteBlogById(@Param('id') id: string) {
        return this.BlogsService.deleteBlogById(id)
    }
}