import { Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Like, LikeDocument, type LikeModelType } from "../domain/like.entity"
import { LikeStatus } from "../dto/create-like-input.dto"
import { Types } from "mongoose"
import { LikeViewDto } from "../dto/like-view.dto"

@Injectable()
export class LikesRepository {
    constructor(@InjectModel(Like.name) private readonly LikeModel: LikeModelType) { }

    async save(like: LikeDocument) {
        await like.save()
    }

    async delete(like: LikeDocument) {
        like.softDeleteSelf()
    }

    async getUserLikeStatus(entityId: Types.ObjectId, userId: Types.ObjectId) {
        const result = await this.LikeModel.findOne(
            {
                entityId: entityId,
                userId: userId
            }
        )

        if (!result) {
            return LikeStatus.None
        }

        return result.status
    }


    async getNewestLikesFromEntity(entityId: Types.ObjectId): Promise<LikeViewDto[]> {
        const items = await this.LikeModel
            .find(
                {
                    entityId: entityId,
                    status: LikeStatus.Like
                }
            )
            .sort({ createdAt: -1 })
            .exec()

        return items.map(like => new LikeViewDto(like)).slice(0, 3)
    }
}