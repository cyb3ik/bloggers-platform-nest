import { LikesInfo } from '../../../comments/domain/comment.entity';
import { LikeStatus } from '../../../likes/dto/create-domain-like.dto';
import { LikeViewDto } from '../../../likes/dto/like-view.dto';
import { PostDocument } from '../../domain/post.entity';

export class PostViewDto {
    id: string
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt: Date
    extendedLikesInfo: LikesInfo | { myStatus: LikeStatus } | { newestLikes: LikeViewDto[] }
    constructor(post: PostDocument, likeStatus: LikeStatus = LikeStatus.None, newestLikes: LikeViewDto[] = []) {
        this.id = post._id.toString()
        this.title = post.title
        this.shortDescription = post.shortDescription
        this.content = post.content
        this.blogId = post.blogId
        this.blogName = post.blogName
        this.createdAt = post.createdAt
        this.extendedLikesInfo = {
            likesCount: post.likesInfo.likesCount,
            dislikesCount: post.likesInfo.dislikesCount,
            myStatus: likeStatus,
            newestLikes: newestLikes
        }
    }
}