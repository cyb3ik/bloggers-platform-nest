import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { PostsQueryParams } from "./dto/posts.query.params-dto";
import { CommentsQueryParams } from "../../comments/api/dto/comments.query.params-dto";
import { CreatePostInputDto, UpdatePostInputDto } from "./dto/posts.input-dto";
import { Types } from "mongoose";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { FindAllPostsQuery } from "../application/use-cases/queries/find-all-posts.query";
import { FindPostByIdQuery } from "../application/use-cases/queries/find-post-by-id.query";
import { FindAllCommentsFromPostQuery } from "../application/use-cases/queries/find-all-comments-from-post.query";
import { CreateCommentInputDto } from "../../comments/api/dto/comments.input-dto";
import { ExtractUserFromRequest } from "../../../../core/decorators/extract-user.decorator";
import { type UserDocument } from "../../../users/domain/user.entity";
import { CreatePostForBlogCommand } from "../../blogs/application/use-cases/commands/create-post-for-blog.usecase";
import { AccessTokenAuthGuard } from "../../../../core/guards/access-token.auth.guard";
import { CreateCommentForPostCommand } from "../application/use-cases/commands/create-comment-for-post.usecase";
import { FindCommentByIdQuery } from "../../comments/application/use-cases/queries/find-comment-by-id.query";
import { UpdatePostCommand } from "../application/use-cases/commands/update-post.usecase";
import { DeletePostCommand } from "../application/use-cases/commands/delete-post.usecase";


@Controller('posts')
export class PostsController {
    constructor(
        private readonly CommandBus: CommandBus,
        private readonly QueryBus: QueryBus
    ) { }

    @Get()
    @HttpCode(HttpStatus.OK)
    async findAllPosts(@Query() query: PostsQueryParams) {

        return this.QueryBus.execute(new FindAllPostsQuery(query))
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    async findPostById(@Param('id') id: Types.ObjectId) {

        return this.QueryBus.execute(new FindPostByIdQuery(id))
    }

    @Get(':postId/comments')
    @HttpCode(HttpStatus.OK)
    async findAllCommentsFromPost(
        @Param('postId') postId: Types.ObjectId,
        @Query() query: CommentsQueryParams) {

        return this.QueryBus.execute(new FindAllCommentsFromPostQuery(postId, query))
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async createPost(@Body() dto: CreatePostInputDto) {

        const blogId = new Types.ObjectId(dto.blogId)

        const createdPostId = await this.CommandBus.execute(new CreatePostForBlogCommand(blogId, dto))

        return this.QueryBus.execute(new FindPostByIdQuery(createdPostId))
    }


    @Post(':postId/comments')
    @UseGuards(AccessTokenAuthGuard)
    async createCommentForPost(
        @ExtractUserFromRequest() user: { id: string, login: string },
        @Param('postId') postId: Types.ObjectId,
        @Body() dto: CreateCommentInputDto) {

        const createdCommentId = await this.CommandBus.execute(new CreateCommentForPostCommand(postId, user, dto))

        return this.QueryBus.execute(new FindCommentByIdQuery(createdCommentId))
    }

    @Put(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async updatePostById(
        @Param('id') id: Types.ObjectId,
        @Body() dto: UpdatePostInputDto) {

        return this.CommandBus.execute(new UpdatePostCommand(id, dto))
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deletePostById(@Param('id') id: Types.ObjectId) {
        return this.CommandBus.execute(new DeletePostCommand(id))
    }
}