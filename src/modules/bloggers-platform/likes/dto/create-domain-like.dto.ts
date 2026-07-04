import { Types } from "mongoose"

export class CreateDomainLikeDto {
    userId: Types.ObjectId
    entityId: Types.ObjectId
    userLogin: string
    status: LikeStatus
}

export enum LikeStatus {
    None = 'None',
    Like = 'Like',
    Dislike = 'Dislike',
}