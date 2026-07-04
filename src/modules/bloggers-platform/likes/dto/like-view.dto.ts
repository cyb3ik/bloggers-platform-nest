import { LikeDocument } from "../domain/like.entity"

export class LikeViewDto {
    addedAt: Date
    userId: string
    login: string

    constructor(like: LikeDocument) {
        this.addedAt = like.createdAt
        this.userId = like.userId.toString()
        this.login = like.userLogin
    }
}