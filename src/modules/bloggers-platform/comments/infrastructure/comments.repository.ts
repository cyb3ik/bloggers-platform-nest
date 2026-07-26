import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Comment, CommentDocument, type CommentModelType } from "../domain/comment.entity";
import { BaseRepository } from "../../../../core/interfaces/repositories/base-repository.interface";

@Injectable()
export class CommentsRepository implements BaseRepository<CommentDocument> {
    constructor(@InjectModel(Comment.name) private readonly CommentModel: CommentModelType) { }

    async save(comment: CommentDocument) {
        await comment.save()
    }

    async findEntityById(id: string): Promise<CommentDocument | null> {
        const comment = await this.CommentModel.findOne({
            _id: id,
            deletedAt: null,
        })

        return comment
    }
}