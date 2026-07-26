export class CreateDomainLikeDto {
    userId: string
    entityId: string
    userLogin: string
    status: LikeStatus
}

export enum LikeStatus {
    None = 'None',
    Like = 'Like',
    Dislike = 'Dislike',
}