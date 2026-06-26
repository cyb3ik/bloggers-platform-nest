import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../domain/user.entity';
import { UsersRepository } from '../infrastructure/users.repository';
import { CreateUserInputDto } from '../api/dto/users.input-dto';
import type { UserModelType } from '../domain/user.entity';
import { BcryptService } from './bcrypt.service';
import { Types } from 'mongoose';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name)
        private readonly UserModel: UserModelType,
        private readonly UsersRepository: UsersRepository,
        private readonly CryptoService: BcryptService
    ) { }

    async createUser(dto: CreateUserInputDto): Promise<Types.ObjectId> {

        const checkByEmail = await this.UsersRepository.findUserByEmail(dto.email)

        if (checkByEmail) {
            throw new BadRequestException([{
                message: "User with this email already exists!",
                field: "email"
            }])
        }

        const checkByLogin = await this.UsersRepository.findUserByLogin(dto.login)

        if (checkByLogin) {
            throw new BadRequestException([{
                message: "User with this login already exists!",
                field: "login"
            }])
        }

        const passwordSalt = await this.CryptoService.generateSalt(10)
        const passwordHash = await this.CryptoService.generateHash(dto.password, passwordSalt)

        const user = this.UserModel.createInstance({
            email: dto.email,
            login: dto.login,
            passwordSalt: passwordSalt,
            passwordHash: passwordHash
        })
        //TODO change behaviour based on current role - admin or user
        //user.setEmailConfirmationStatus(true)

        await this.UsersRepository.save(user)

        return user._id
    }

    async deleteUserById(id: Types.ObjectId): Promise<void> {
        const user = await this.UsersRepository.findUserByIdOrFail(id)

        if (!user) {
            //TODO: replace with domain exception
            throw new NotFoundException('User not found')
        }

        user.softDeleteSelf()

        await this.UsersRepository.save(user)
    }

    async updateUserPassword(id: Types.ObjectId, newPassword: string) {
        const user = await this.UsersRepository.findUserByIdOrFail(id)

        const passwordSalt = await this.CryptoService.generateSalt(10)
        const passwordHash = await this.CryptoService.generateHash(newPassword, passwordSalt)

        user.passwordHash = passwordHash
        user.passwordSalt = passwordSalt

        user.forbidPasswordRecovery()

        await this.UsersRepository.save(user)
    }

}