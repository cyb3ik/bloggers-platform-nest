import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Query } from '@nestjs/common';
import { UsersService } from '../application/users.service';
import { CreateUserInputDto } from './dto/users.input-dto';
import { UsersQueryRepository } from '../infrastructure/users.query.repository';
import { UsersQueryParams } from './dto/users.query.params-dto';

@Controller('users')
export class UsersController {

    constructor(
        private readonly UsersService: UsersService,
        private readonly UsersQueryRepository: UsersQueryRepository
    ) { }

    @Get()
    @HttpCode(HttpStatus.OK)
    async findAllUsers(@Query() query: UsersQueryParams) {
        return this.UsersQueryRepository.findAllUsers(query)
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    async findUserById(@Param('id') id: string) {
        return this.UsersQueryRepository.findUserByIdOrFail(id)
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async createUser(@Body() dto: CreateUserInputDto) {
        const createdUserId = await this.UsersService.createUser(dto)

        return this.UsersQueryRepository.findUserByIdOrFail(createdUserId)
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteUserById(@Param('id') id: string) {
        return this.UsersService.deleteUserById(id)
    }
}
