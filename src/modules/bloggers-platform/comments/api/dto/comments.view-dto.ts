
import { LikeStatus } from '../../../likes/dto/create-like-input.dto';
import { CommentatorInfo, CommentDocument, LikesInfo } from '../../domain/comment.entity';

export class CommentViewDto {
    id: string
    content: string
    commentatorInfo: CommentatorInfo
    createdAt: Date
    likesInfo: LikesInfo | { myStatus: LikeStatus }

    constructor(comment: CommentDocument, likeStatus: LikeStatus = LikeStatus.None) {
        this.id = comment._id.toString()
        this.content = comment.content
        this.commentatorInfo = comment.commentatorInfo
        this.createdAt = comment.createdAt
        this.likesInfo = {
            ...comment.likesInfo,
            myStatus: likeStatus
        }
    }
}