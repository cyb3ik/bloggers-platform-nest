import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query } from "@nestjs/common";
import { PostsQueryParams } from "./dto/posts.query.params-dto";
import { CommentsQueryParams } from "../../comments/api/dto/comments.query.params-dto";
import { CreatePostInputDto, UpdatePostInputDto } from "./dto/posts.input-dto";
import { PostsService } from "../application/posts.service";
import { PostsQueryRepository } from "../infrastructure/posts.query.repository";
import { CommentsQueryRepository } from "../../comments/infrastructure/comments.query.repository";
import { ParseObjectIdPipe } from "@nestjs/mongoose";


@Controller('posts')
export class PostsController {
    constructor(
        private readonly PostsService: PostsService,
        private readonly PostsQueryRepository: PostsQueryRepository,
        // private readonly CommentsService: CommentsService,
        private readonly CommentsQueryRepository: CommentsQueryRepository
    ) { }

    @Get()
    @HttpCode(HttpStatus.OK)
    async findAllPosts(@Query() query: PostsQueryParams) {
        return this.PostsQueryRepository.findAllPosts(query)
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    async findPostById(@Param('id', ParseObjectIdPipe) id: string) {
        return this.PostsQueryRepository.findPostByIdOrFail(id)
    }

    @Get(':postId/comments')
    @HttpCode(HttpStatus.OK)
    async findAllCommentsFromPost(
        @Param('postId', ParseObjectIdPipe) postId: string,
        @Query() query: CommentsQueryParams) {

        // TOCHECK спросить как лучше такое реализовать - в квери сервисе или оставить как есть
        await this.PostsQueryRepository.findPostByIdOrFail(postId)

        return this.CommentsQueryRepository.findAllCommentsFromPost(postId, query)
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async createPost(@Body() dto: CreatePostInputDto) {
        const createdPostId = await this.PostsService.createPost(dto)

        return this.PostsQueryRepository.findPostByIdOrFail(createdPostId)
    }


    // @Post(':postId/comments')
    // async createCommentForPost(
    //     @Param('postId') postId: string,
    //     @Body() dto: CreateCommentForPostInputDto) {

    //     const createdCommentId = await this.CommentsService.createCommentForPost(postId, dto)

    //     return this.CommentsQueryRepository.findCommentIdOrFail(createdCommentId)
    // }

    @Put(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async updatePostById(
        @Param('id', ParseObjectIdPipe) id: string,
        @Body() dto: UpdatePostInputDto) {

        await this.PostsQueryRepository.findPostByIdOrFail(id)

        return this.PostsService.updatePostById(id, dto)
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deletePostById(@Param('id', ParseObjectIdPipe) id: string) {
        return this.PostsService.deletePostById(id)
    }
}