import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../domain/user.entity';
import { UsersRepository } from '../infrastructure/users.repository';
import { CreateUserInputDto } from '../api/dto/users.input-dto';
import type { UserModelType } from '../domain/user.entity';
import { BcryptService } from './bcrypt.service';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name)
        private readonly UserModel: UserModelType,
        private readonly UsersRepository: UsersRepository,
        private readonly CryptoService: BcryptService
    ) { }

    async createUser(dto: CreateUserInputDto): Promise<string> {

        const passwordSalt = await this.CryptoService.generateSalt(10)
        const passwordHash = await this.CryptoService.generateHash(dto.password, passwordSalt)

        const user = this.UserModel.createInstance({
            email: dto.email,
            login: dto.login,
            passwordSalt: passwordSalt,
            passwordHash: passwordHash
        })

        await this.UsersRepository.save(user)

        return user._id.toString()
    }

    async deleteUserById(id: string): Promise<void> {
        const user = await this.UsersRepository.findUserByIdOrFail(id)

        user.softDeleteSelf()

        await this.UsersRepository.save(user)
    }
}