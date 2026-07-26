import { CommentatorInfo } from "../comment.entity"

export class CreateDomainCommentDto {
    content: string
    commentatorInfo: CommentatorInfo
    postId: string
}