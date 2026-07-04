import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../domain/user.entity';
import { UsersRepository } from '../infrastructure/users.repository';
import { BcryptService } from './bcrypt.service';
import { Types } from 'mongoose';

@Injectable()
export class UsersService {
    constructor(
        private readonly UsersRepository: UsersRepository,
        private readonly CryptoService: BcryptService
    ) { }

    async checkIfUserIsUnique(email: string, login: string): Promise<void> {
        const checkByEmail = await this.UsersRepository.findUserByEmail(email)

        if (checkByEmail) {
            throw new BadRequestException([{
                message: "User with this email already exists!",
                field: "email"
            }])
        }

        const checkByLogin = await this.UsersRepository.findUserByLogin(login)

        if (checkByLogin) {
            throw new BadRequestException([{
                message: "User with this login already exists!",
                field: "login"
            }])
        }
    }

    async updateUserPassword(id: Types.ObjectId, newPassword: string) {
        const user = await this.UsersRepository.findUserById(id)

        if (!user) {
            //TODO: replace with domain exception
            throw new NotFoundException('User not found')
        }

        const passwordSalt = await this.CryptoService.generateSalt(10)
        const passwordHash = await this.CryptoService.generateHash(newPassword, passwordSalt)

        await this.UsersRepository.updateUserPassword(user, { passwordHash: passwordHash, passwordSalt: passwordSalt })

        await this.UsersRepository.save(user)
    }

}