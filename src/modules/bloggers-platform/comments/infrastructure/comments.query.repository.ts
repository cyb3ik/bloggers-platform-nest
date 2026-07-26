import { Injectable } from "@nestjs/common";
import { Comment, type CommentModelType } from "../domain/comment.entity";
import { InjectModel } from "@nestjs/mongoose";
import { CommentViewDto } from "../api/dto/comments.view-dto";
import { CommentsQueryParams } from "../api/dto/comments.query.params-dto";
import { PaginatedViewDto } from "../../../../core/dto/paginated.view-dto";
import { ICommentsQueryRepository } from "../../../../core/interfaces/repositories/comments/commets-query-repository.interface";

@Injectable()
export class CommentsQueryRepository implements ICommentsQueryRepository {
    constructor(@InjectModel(Comment.name) private readonly CommentModel: CommentModelType) { }

    async getEntityById(id: string): Promise<CommentViewDto | null> {
        const comment = await this.CommentModel.findOne({
            _id: id,
            deletedAt: null,
        })

        return new CommentViewDto(comment)
    }

    async getAllEntities(query: CommentsQueryParams): Promise<PaginatedViewDto<CommentViewDto[]>> {
        const { pageSize, sortBy, sortDirection, pageNumber } = query

        const skip = query.calculateSkip()

        const filter: any = { deletedAt: null }

        const result = await this.CommentModel
            .find(filter)
            .sort({ [sortBy]: sortDirection })
            .skip(skip)
            .limit(pageSize)
            .exec()

        const totalCount = await this.CommentModel.countDocuments(filter)

        return PaginatedViewDto.mapToView({
            items: result.map(comment => new CommentViewDto(comment)),
            page: pageNumber,
            size: pageSize,
            totalCount: totalCount
        })
    }

    async getAllCommentsFromPost(postId: string, query: CommentsQueryParams): Promise<PaginatedViewDto<CommentViewDto[]>> {

        const { pageSize, sortBy, sortDirection, pageNumber } = query

        const skip = query.calculateSkip()

        const filter: any = { postId: postId, deletedAt: null }

        const result = await this.CommentModel
            .find(filter)
            .sort({ [sortBy]: sortDirection })
            .skip(skip)
            .limit(pageSize)
            .exec()

        const totalCount = await this.CommentModel.countDocuments(filter)

        return PaginatedViewDto.mapToView({
            items: result.map(comment => new CommentViewDto(comment)),
            page: pageNumber,
            size: pageSize,
            totalCount: totalCount
        })
    }
}