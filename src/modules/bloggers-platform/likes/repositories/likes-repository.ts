import { Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Like, LikeDocument, type LikeModelType } from "../domain/like.entity"
import { LikeViewDto } from "../dto/like-view.dto"
import { ILikesRepository } from "../../../../core/interfaces/repositories/likes/likes-repository.interface"
import { Types } from "mongoose"

@Injectable()
export class LikesRepository implements ILikesRepository {
    constructor(@InjectModel(Like.name) private readonly LikeModel: LikeModelType) { }

    async save(like: LikeDocument) {
        await like.save()
    }

    async findEntityById(id: string): Promise<LikeDocument | null> {
        const like = await this.LikeModel.findOne(
            {
                _id: id
            }
        )

        if (!like) {
            return null
        }

        return like
    }

    async findLikeByUserId(entityId: string, userId: string) {
        const like = await this.LikeModel.findOne(
            {
                entityId: entityId,
                userId: userId
            }
        )

        if (!like) {
            return null
        }

        return like
    }


    async getNewestLikesFromEntity(entityId: string): Promise<LikeViewDto[]> {
        const items = await this.LikeModel
            .find(
                {
                    entityId: entityId,
                    status: "Like"
                }
            )
            .sort({ createdAt: -1 })
            .exec()

        return items.map(like => new LikeViewDto(like)).slice(0, 3)
    }

    async getLikesAndDislikesCount(entityId: string): Promise<{ likesCount: number, dislikesCount: number }> {
        const likesCount = await this.LikeModel.countDocuments({
            entityId: entityId,
            status: "Like"
        })

        const dislikesCount = await this.LikeModel.countDocuments({
            entityId: entityId,
            status: "Dislike"
        })

        return { likesCount: likesCount, dislikesCount: dislikesCount }
    }
}