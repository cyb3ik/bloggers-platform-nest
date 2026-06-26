import { Controller, Get, HttpCode, HttpStatus, Param } from "@nestjs/common";
import { CommentsQueryRepository } from "../infrastructure/comments.query.repository";
import { ParseObjectIdPipe } from "@nestjs/mongoose";
import { Types } from "mongoose";

@Controller('comments')
export class CommentsController {
    constructor(
        private readonly CommentsQueryRepository: CommentsQueryRepository
    ) { }

    @Get('id')
    @HttpCode(HttpStatus.OK)
    async findCommentById(@Param('id') id: Types.ObjectId) {
        return this.CommentsQueryRepository.findCommentByIdOrFail(id)
    }
}