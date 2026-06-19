import { Controller, Get, HttpCode, HttpStatus, Param } from "@nestjs/common";
import { CommentsQueryRepository } from "../infrastructure/comments.query.repository";
import { ParseObjectIdPipe } from "@nestjs/mongoose";

@Controller('comments')
export class CommentsController {
    constructor(
        private readonly CommentsQueryRepository: CommentsQueryRepository
    ) { }

    @Get('id')
    @HttpCode(HttpStatus.OK)
    async findCommentById(@Param('id', ParseObjectIdPipe) id: string) {
        return this.CommentsQueryRepository.findCommentByIdOrFail(id)
    }
}