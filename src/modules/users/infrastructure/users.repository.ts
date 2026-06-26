import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../domain/user.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import type { UserModelType } from '../domain/user.entity';
import { Types } from 'mongoose';

@Injectable()
export class UsersRepository {
    constructor(@InjectModel(User.name) private readonly UserModel: UserModelType) { }

    async save(user: UserDocument) {
        await user.save()
    }

    async findUserByIdOrFail(id: Types.ObjectId): Promise<UserDocument | null> {
        const user = await this.UserModel.findOne({
            _id: id,
            deletedAt: null,
        })

        return user
    }

    async findUserByEmailOrLogin(email: string, login: string): Promise<UserDocument | null> {
        const user = await this.UserModel.findOne({
            $or: [
                { login: login },
                { email: email }
            ],
            deletedAt: null,
        })

        return user
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

    async findUserByConfirmationCodeOrFail(code: string): Promise<UserDocument | null> {
        const user = await this.UserModel.findOne(
            {
                "emailConfirmation.confirmationCode": code,
                deletedAt: null
            })

        return user
    }

    async findUserByRecoveryCodeOrFail(code: string): Promise<UserDocument | null> {
        const user = await this.UserModel.findOne(
            {
                "passwordRecovery.recoveryCode": code,
                deletedAt: null
            })

        return user
    }
}
