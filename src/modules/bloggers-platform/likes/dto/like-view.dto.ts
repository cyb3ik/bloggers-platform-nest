import { LikeDocument } from "../domain/like.entity"

export class LikeViewDto {
    addedAt: string
    userId: string
    login: string

    constructor(like: LikeDocument) {
        this.addedAt = like.createdAt.toISOString()
        this.userId = like.userId.toString()
        this.login = like.userLogin
    }
}