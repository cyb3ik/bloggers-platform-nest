import { Types } from "mongoose"
import { CommentatorInfo, LikesInfo } from "../comment.entity"

export class CreateDomainCommentDto {
    content: string
    commentatorInfo: CommentatorInfo
    postId: Types.ObjectId
}