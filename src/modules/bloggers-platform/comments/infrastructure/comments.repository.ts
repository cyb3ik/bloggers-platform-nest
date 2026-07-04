import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Comment, CommentDocument, type CommentModelType } from "../domain/comment.entity";
import { Types } from "mongoose";

@Injectable()
export class CommentsRepository {
    constructor(@InjectModel(Comment.name) private readonly CommentModel: CommentModelType) { }

    async save(comment: CommentDocument) {
        await comment.save()
    }

    async delete(comment: CommentDocument) {
        comment.softDeleteSelf()
    }

    async findCommentById(id: Types.ObjectId): Promise<CommentDocument | null> {
        const comment = await this.CommentModel.findOne({
            _id: id,
            deletedAt: null,
        })

        return comment
    }
}