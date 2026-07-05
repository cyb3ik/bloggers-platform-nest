import { Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Like, LikeDocument, type LikeModelType } from "../domain/like.entity"
import { Types } from "mongoose"
import { LikeViewDto } from "../dto/like-view.dto"
import { LikeStatus } from "../dto/create-domain-like.dto"

@Injectable()
export class LikesRepository {
    constructor(@InjectModel(Like.name) private readonly LikeModel: LikeModelType) { }

    async save(like: LikeDocument) {
        await like.save()
    }

    async delete(like: LikeDocument) {
        like.softDeleteSelf()
    }

    async getUserLikeEntityAndStatus(entityId: Types.ObjectId, userId: Types.ObjectId) {
        const result = await this.LikeModel.findOne(
            {
                entityId: entityId.toString(),
                userId: userId
            }
        )

        if (!result) {
            return {
                status: LikeStatus.None,
                like: null
            }
        }

        return {
            status: result.status,
            like: result
        }
    }


    async getNewestLikesFromEntity(entityId: Types.ObjectId): Promise<LikeViewDto[]> {
        const items = await this.LikeModel
            .find(
                {
                    entityId: entityId.toString(),
                    status: "Like"
                }
            )
            .sort({ createdAt: -1 })
            .exec()

        return items.map(like => new LikeViewDto(like)).slice(0, 3)
    }
}