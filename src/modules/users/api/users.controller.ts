import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { UsersService } from '../application/users.service';
import { CreateUserInputDto } from './dto/users.input-dto';
import { UsersQueryRepository } from '../infrastructure/users.query.repository';
import { UsersQueryParams } from './dto/users.query.params-dto';

@Controller('users')
export class UsersController {

    //TODO status codes
    constructor(
        private readonly UsersService: UsersService,
        private readonly UsersQueryRepository: UsersQueryRepository
    ) { }

    @Get()
    async findAllUsers(@Query() query: UsersQueryParams) {
        return this.UsersQueryRepository.findAllUsers(query)
    }

    @Get(':id')
    async findUserById(@Param('id') id: string) {
        return this.UsersQueryRepository.findUserByIdOrFail(id)
    }

    @Post()
    async createUser(@Body() dto: CreateUserInputDto) {
        const createdUserId = await this.UsersService.createUser(dto)

        return this.UsersQueryRepository.findUserByIdOrFail(createdUserId)
    }

    @Delete(':id')
    async deleteUserById(@Param('id') id: string) {
        return this.UsersService.deleteUser(id)
    }
}
