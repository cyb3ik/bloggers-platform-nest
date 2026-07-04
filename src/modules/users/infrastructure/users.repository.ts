import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../domain/user.entity';
import { Injectable } from '@nestjs/common';
import type { UserModelType } from '../domain/user.entity';
import { Types } from 'mongoose';

@Injectable()
export class UsersRepository {
    constructor(@InjectModel(User.name) private readonly UserModel: UserModelType) { }

    async save(user: UserDocument) {
        await user.save()
    }

    async delete(user: UserDocument) {
        user.softDeleteSelf()
    }

    async updateUserPassword(user: UserDocument, newPasswordInfo: { passwordHash: string, passwordSalt: string }) {
        const { passwordHash, passwordSalt } = newPasswordInfo

        user.passwordHash = passwordHash
        user.passwordSalt = passwordSalt

        user.forbidPasswordRecovery()
    }

    async findUserById(id: Types.ObjectId): Promise<UserDocument | null> {
        const user = await this.UserModel.findOne({
            _id: id,
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
