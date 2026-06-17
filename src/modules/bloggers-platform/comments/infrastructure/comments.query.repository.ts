import { Injectable, NotFoundException } from "@nestjs/common";
import { Comment, type CommentModelType } from "../domain/comment.entity";
import { InjectModel } from "@nestjs/mongoose";
import { CommentViewDto } from "../api/dto/comments.view-dto";
import { CommentsQueryParams } from "../api/dto/comments.query.params-dto";
import { PaginatedViewDto } from "../../../../core/dto/paginated.view-dto";
import { Types } from "mongoose";

@Injectable()
export class CommentsQueryRepository {
    constructor(@InjectModel(Comment.name) private readonly CommentModel: CommentModelType) { }

    async findCommentByIdOrFail(id: string): Promise<CommentViewDto> {
        if (!Types.ObjectId.isValid(id)) {
            throw new NotFoundException('Comment not found')
        }
        const comment = await this.CommentModel.findOne({
            _id: id,
            deletedAt: null,
        })

        if (!comment) {
            throw new NotFoundException('Comment not found')
        }

        return new CommentViewDto(comment)
    }

    async findAllCommentsFromPost(postId: string, query: CommentsQueryParams): Promise<PaginatedViewDto<CommentViewDto[]>> {

        const { pageNumber, pageSize, sortBy, sortDirection } = query

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