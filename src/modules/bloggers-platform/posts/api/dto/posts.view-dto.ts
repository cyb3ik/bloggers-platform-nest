import { LikeViewDto } from '../../../likes/dto/like-view.dto';
import { LikeStatus } from '../../../likes/dto/like.raw-dto';
import { PostDocument } from '../../domain/post.entity';

export class PostViewDto {
    id: string
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt: Date
    extendedLikesInfo: {
        likesCount: number
        dislikesCount: number
        myStatus: LikeStatus
        newestLikes: LikeViewDto[]
    }
    constructor(post: PostDocument) {
        this.id = post._id.toString()
        this.title = post.title
        this.shortDescription = post.shortDescription
        this.content = post.content
        this.blogId = post.blogId
        this.blogName = post.blogName
        this.createdAt = post.createdAt
    }

    addLikesInfo(likesCount: number, dislikesCount: number, likeStatus: LikeStatus, newestLikes: LikeViewDto[]) {
        this.extendedLikesInfo = {
            likesCount: likesCount,
            dislikesCount: dislikesCount,
            myStatus: likeStatus,
            newestLikes: newestLikes
        }
    }
}