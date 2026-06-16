import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Blog, BlogSchema } from "./blogs/domain/blog.entity";
import { Post, PostSchema } from "./posts/domain/post.entity";
import { Comment, CommentSchema } from "./comments/domain/comment.entity";
import { BlogsService } from "./blogs/application/blogs.service";
import { BlogsRepository } from "./blogs/infrastructure/blogs.repository";
import { BlogsQueryRepository } from "./blogs/infrastructure/blogs.query.repository";
import { PostsService } from "./posts/application/posts.service";
import { PostsRepository } from "./posts/infrastructure/posts.repository";
import { PostsQueryRepository } from "./posts/infrastructure/posts.query.repository";
import { CommentsService } from "./comments/application/comments.service";
import { CommentsRepository } from "./comments/infrastructure/comments.repository";
import { CommentsQueryRepository } from "./comments/infrastructure/comments.query.repository";
import { BlogsController } from "./blogs/api/blogs.controller";
import { PostsController } from "./posts/api/posts.controller";
import { CommentsController } from "./comments/api/comments.controller";

@Module({
    imports: [MongooseModule.forFeature([
        { name: Blog.name, schema: BlogSchema },
        { name: Post.name, schema: PostSchema },
        { name: Comment.name, schema: CommentSchema }
    ])],
    providers: [
        BlogsService,
        BlogsRepository,
        BlogsQueryRepository,
        PostsService,
        PostsRepository,
        PostsQueryRepository,
        CommentsService,
        CommentsRepository,
        CommentsQueryRepository
    ],
    controllers: [
        BlogsController,
        PostsController,
        CommentsController
    ]
})

export class BloggersPlatformModule { }
