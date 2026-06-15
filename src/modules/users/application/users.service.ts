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
        private UserModel: UserModelType,
        private usersRepository: UsersRepository,
        private cryptoService: BcryptService
    ) { }

    async createUser(dto: CreateUserInputDto): Promise<string> {

        const passwordSalt = await this.cryptoService.generateSalt(10)
        const passwordHash = await this.cryptoService.generateHash(dto.password, passwordSalt)

        const user = this.UserModel.createInstance({
            email: dto.email,
            login: dto.login,
            passwordSalt: passwordSalt,
            passwordHash: passwordHash
        })

        await this.usersRepository.save(user)

        return user._id.toString()
    }

    async deleteUser(id: string) {
        const user = await this.usersRepository.findUserByIdOrFail(id);

        user.softDeleteSelf();

        await this.usersRepository.save(user);
    }
}