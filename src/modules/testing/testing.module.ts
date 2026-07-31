import { Module } from '@nestjs/common';
import { TestingController } from './testing.controller';
import { TestingService } from './testing.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoBlog, BlogSchema } from '../bloggers-platform/blogs/domain/blog-mongoose.entity';
import { Session, SessionSchema } from '../sessions/session.entity';
import { Request, RequestSchema } from '../../core/requests/request.entity';
import { MongoUser, UserSchema } from '../users/domain/user-mongoose.entity';
import { LikeSchema, MongoLike } from '../bloggers-platform/likes/domain/like-mongoose.entity';
import { MongoPost, PostSchema } from '../bloggers-platform/posts/domain/post-mongoose.entity';
import { CommentSchema, MongoComment } from '../bloggers-platform/comments/domain/comment-mongoose.entity';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: MongoUser.name, schema: UserSchema },
            { name: MongoBlog.name, schema: BlogSchema },
            { name: MongoPost.name, schema: PostSchema },
            { name: MongoComment.name, schema: CommentSchema },
            { name: MongoLike.name, schema: LikeSchema },
            { name: Session.name, schema: SessionSchema },
            { name: Request.name, schema: RequestSchema }])
    ],
    controllers: [TestingController],
    providers: [TestingService]
})
export class TestingModule { }