import { Query } from '@nestjs/cqrs';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';
import { MePageView } from '../../../api/dto/view/me-page-view.dto';
import { AuthQueryRepository } from '../../../infrastructure/auth.query.repository';
import { Types } from 'mongoose';

export class GetMePageQuery extends Query<MePageView> {
    constructor(
        public readonly userId: Types.ObjectId
    ) {
        super()
    }
}

@QueryHandler(GetMePageQuery)
export class GetMePageQueryHandler implements IQueryHandler<GetMePageQuery> {
    constructor(
        private readonly AuthQueryRepository: AuthQueryRepository) { }

    async execute(query: GetMePageQuery): Promise<MePageView> {
        const mePage = await this.AuthQueryRepository.getMePage(
            query.userId
        )

        if (!mePage) {
            throw new NotFoundException('User not found')
        }

        return mePage
    }
}