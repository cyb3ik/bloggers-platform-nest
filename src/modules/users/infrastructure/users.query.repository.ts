import { InjectModel } from '@nestjs/mongoose';
import { User } from '../domain/user.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import type { UserModelType } from '../domain/user.entity';
import { UserViewDto } from '../api/dto/users.view-dto';
import { UsersQueryParams } from '../api/dto/users.query.params-dto';
import { PaginatedViewDto } from '../../../core/dto/paginated.view-dto';
import { Types } from 'mongoose';

@Injectable()
export class UsersQueryRepository {
    constructor(@InjectModel(User.name) private readonly UserModel: UserModelType) { }

    async findUserById(id: Types.ObjectId): Promise<UserViewDto | null> {
        const user = await this.UserModel.findOne({
            _id: id,
            deletedAt: null,
        })

        if (!user) {
            return null
        }

        return new UserViewDto(user)
    }

    async findAllUsers(query: UsersQueryParams): Promise<PaginatedViewDto<UserViewDto[]>> {

        const { pageNumber, pageSize, sortBy, sortDirection, searchLoginTerm, searchEmailTerm } = query

        const skip = query.calculateSkip()

        const filter: any = { deletedAt: null }

        if (searchEmailTerm || searchLoginTerm) {
            filter.$or = []
        }

        if (searchLoginTerm) {
            filter.$or.push({ login: { $regex: searchLoginTerm, $options: 'i' } })
        }

        if (searchEmailTerm) {
            filter.$or.push({ email: { $regex: searchEmailTerm, $options: 'i' } })
        }

        const result = await this.UserModel
            .find(filter)
            .sort({ [sortBy]: sortDirection })
            .skip(skip)
            .limit(pageSize)
            .exec()

        const totalCount = await this.UserModel.countDocuments(filter)

        return PaginatedViewDto.mapToView({
            items: result.map(user => new UserViewDto(user)),
            page: pageNumber,
            size: pageSize,
            totalCount: totalCount
        })
    }
}
