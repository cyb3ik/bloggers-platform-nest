import { LikesInfo, LikeStatus } from '../../../comments/domain/comment.entity';
import { PostDocument } from '../../domain/posts.entity';

export class PostViewDto {
    id: string
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt: Date
    //@ts-ignore TODO likes
    extendedLikesInfo: LikesInfo | { myStatus: LikeStatus } | { newestLikes: LikeViewDto[] }
    //@ts-ignore    
    constructor(post: PostDocument, likeStatus: LikeStatus = LikeStatus.None, newestLikes: LikeViewDto[] = []) {
        this.id = post._id.toString()
        this.title = post.title
        this.shortDescription = post.shortDescription
        this.content = post.content
        this.blogId = post.blogId
        this.blogName = post.blogName
        this.createdAt = post.createdAt
        this.extendedLikesInfo = {
            ...post.likesInfo,
            myStatus: likeStatus,
            newestLikes: newestLikes
        }
    }
}