import { LikeStatus } from '../../../likes/dto/like.raw-dto';
import { CommentatorInfo, CommentDocument } from '../../domain/comment.entity';

export class CommentViewDto {
    id: string
    content: string
    commentatorInfo: CommentatorInfo
    createdAt: Date
    likesInfo: {
        likesCount: number,
        dislikesCount: number,
        likeStatus: LikeStatus
    }

    constructor(comment: CommentDocument) {
        this.id = comment._id.toString()
        this.content = comment.content
        this.commentatorInfo = comment.commentatorInfo
        this.createdAt = comment.createdAt
    }

    addLikesInfo(likesCount: number, dislikesCount: number, likeStatus: LikeStatus) {
        this.likesInfo = {
            likesCount: likesCount,
            dislikesCount: dislikesCount,
            likeStatus: likeStatus
        }
    }
}