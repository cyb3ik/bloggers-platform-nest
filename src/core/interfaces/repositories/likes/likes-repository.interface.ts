import { LikeDocument } from "../../../../modules/bloggers-platform/likes/domain/like.entity";
import { LikeViewDto } from "../../../../modules/bloggers-platform/likes/dto/like-view.dto";
import { BaseRepository } from "../base-repository.interface";

export interface ILikesRepository extends BaseRepository<LikeDocument> {
    findLikeByUserId(entityId: string, userId: string): Promise<LikeDocument | null>

    getNewestLikesFromEntity(entityId: string): Promise<LikeViewDto[]>

    getLikesAndDislikesCount(entityId: string): Promise<{ likesCount: number, dislikesCount: number }>
}