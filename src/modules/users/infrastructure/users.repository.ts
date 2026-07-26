import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../domain/user.entity';
import { Injectable } from '@nestjs/common';
import type { UserModelType } from '../domain/user.entity';
import { BaseRepository } from '../../../core/interfaces/repositories/base-repository.interface';
import { IUsersRepository } from '../../../core/interfaces/repositories/users/users-repository.interface';

@Injectable()
export class UsersRepository implements IUsersRepository {
    constructor(@InjectModel(User.name) private readonly UserModel: UserModelType) { }

    async save(user: UserDocument): Promise<void> {
        await user.save()
        return
    }

    async findEntityById(id: string): Promise<UserDocument | null> {
        const user = await this.UserModel.findOne({
            _id: id,
            deletedAt: null,
        })

        return user as UserDocument | null
    }

    async findUserByEmail(email: string): Promise<UserDocument | null> {
        const user = await this.UserModel.findOne({
            email: email,
            deletedAt: null,
        })

        return user
    }

    async findUserByLogin(login: string): Promise<UserDocument | null> {
        const user = await this.UserModel.findOne({
            login: login,
            deletedAt: null,
        })

        return user
    }

    async findUserByConfirmationCode(code: string): Promise<UserDocument | null> {
        const user = await this.UserModel.findOne(
            {
                "emailConfirmation.confirmationCode": code,
                deletedAt: null
            })

        return user
    }

    async findUserByRecoveryCode(code: string): Promise<UserDocument | null> {
        const user = await this.UserModel.findOne(
            {
                "passwordRecovery.recoveryCode": code,
                deletedAt: null
            })

        return user
    }
}
