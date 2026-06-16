import { Controller, Get, HttpCode, HttpStatus, Param } from "@nestjs/common";
import { CommentsQueryRepository } from "../infrastructure/comments.query.repository";

@Controller('comments')
export class CommentsController {
    constructor(
        private readonly CommentsQueryRepository: CommentsQueryRepository
    ) { }

    @Get('id')
    @HttpCode(HttpStatus.OK)
    async findCommentById(@Param('id') id: string) {
        return this.CommentsQueryRepository.findCommentByIdOrFail(id)
    }
}