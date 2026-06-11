import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../domain/user.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import type { UserModelType } from '../domain/user.entity';

@Injectable()
export class UsersRepository {
    constructor(@InjectModel(User.name) private UserModel: UserModelType) { }

    async save(user: UserDocument) {
        await user.save()
    }

    async findUserByIdOrFail(id: string): Promise<UserDocument> {
        const user = await this.UserModel.findOne({
            _id: id,
            deletedAt: null,
        })

        if (!user) {
            //TODO: replace with domain exception
            throw new NotFoundException('user not found')
        }

        return user
    }
}
