import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User, type UserModelType } from "../users/domain/user.entity";
import { Blog, type BlogModelType } from "../bloggers-platform/blogs/domain/blog.entity";
import { Post, type PostModelType } from "../bloggers-platform/posts/domain/post.entity";
import { Comment, type CommentModelType } from "../bloggers-platform/comments/domain/comment.entity";
import { Like, type LikeModelType } from "../bloggers-platform/likes/domain/like.entity";
import { Session, type SessionModelType } from "../sessions/session.entity";
import { Request, type RequestModelType } from "../../core/requests/request.entity";

@Injectable()
export class TestingService {
    constructor(
        @InjectModel(User.name)
        private readonly UserModel: UserModelType,
        @InjectModel(Blog.name)
        private readonly BlogModel: BlogModelType,
        @InjectModel(Post.name)
        private readonly PostModel: PostModelType,
        @InjectModel(Comment.name)
        private readonly CommentModel: CommentModelType,
        @InjectModel(Like.name)
        private readonly LikeModel: LikeModelType,
        @InjectModel(Session.name)
        private readonly SessionModel: SessionModelType,
        @InjectModel(Request.name)
        private readonly RequestModel: RequestModelType

    ) { }

    async deleteAll() {
        await this.UserModel.deleteMany({})
        await this.BlogModel.deleteMany({})
        await this.PostModel.deleteMany({})
        await this.CommentModel.deleteMany({})
        await this.LikeModel.deleteMany({})
        await this.SessionModel.deleteMany({})
        await this.RequestModel.deleteMany({})
    }
}