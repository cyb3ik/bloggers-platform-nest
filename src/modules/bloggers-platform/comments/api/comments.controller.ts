import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Put, UseGuards } from "@nestjs/common";
import { CommentsQueryRepository } from "../infrastructure/comments.query.repository";
import { ParseObjectIdPipe } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { FindCommentByIdQuery } from "../application/use-cases/queries/find-comment-by-id.query";
import { UpdateCommentCommand } from "../application/use-cases/commands/update-comment.usecase";
import { UpdateCommentInputDto } from "./dto/comments.input-dto";
import { DeleteCommentCommand } from "../application/use-cases/commands/delete-comment.usecase";
import { AccessTokenAuthGuard } from "../../../../core/guards/access-token.auth.guard";
import { ExtractUserFromRequest } from "../../../../core/decorators/extract-user.decorator";
import { UserInfo } from "../../../users/api/dto/user-info.dto";

@Controller('comments')
export class CommentsController {
    constructor(
        private readonly CommandBus: CommandBus,
        private readonly QueryBus: QueryBus,
    ) { }

    @Get('id')
    @UseGuards(AccessTokenAuthGuard)
    @HttpCode(HttpStatus.OK)
    async findCommentById(
        @ExtractUserFromRequest() user: UserInfo,
        @Param('id') id: Types.ObjectId
    ) {

        return this.QueryBus.execute(new FindCommentByIdQuery(id, user.id))
    }

    @Put('id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async updateCommentById(
        @Param('id') id: Types.ObjectId,
        @Body() dto: UpdateCommentInputDto) {

        return this.CommandBus.execute(new UpdateCommentCommand(id, dto))
    }

    @Delete('id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteCommentById(@Param('id') id: Types.ObjectId) {

        return this.CommandBus.execute(new DeleteCommentCommand(id))
    }
}