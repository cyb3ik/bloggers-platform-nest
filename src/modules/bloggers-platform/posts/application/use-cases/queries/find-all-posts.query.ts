import { IQueryHandler, Query, QueryBus, QueryHandler } from '@nestjs/cqrs';
import { PaginatedViewDto } from '../../../../../../core/dto/paginated.view-dto';
import { PostViewDto } from '../../../api/dto/posts.view-dto';
import { PostsQueryParams } from '../../../api/dto/posts.query.params-dto';
import { PostsQueryRepository } from '../../../infrastructure/posts.query.repository';
import { Types } from 'mongoose';
import { LikesRepository } from '../../../../likes/repositories/likes-repository';
import { LikeStatus } from '../../../../likes/dto/create-domain-like.dto';

export class FindAllPostsQuery extends Query<PaginatedViewDto<PostViewDto[]>> {
    constructor(
        public readonly query: PostsQueryParams,
        public readonly userId?: Types.ObjectId
    ) {
        super()
    }
}

@QueryHandler(FindAllPostsQuery)
export class FindAllPostsQueryHandler implements IQueryHandler<FindAllPostsQuery> {
    constructor(
        private readonly PostsQueryRepository: PostsQueryRepository,
        private readonly LikesRepository: LikesRepository,
    ) { }

    async execute(query: FindAllPostsQuery): Promise<PaginatedViewDto<PostViewDto[]>> {
        const { items, totalCount } = await this.PostsQueryRepository.findAllPosts(query.query)

        const itemsWithStatuses = []

        if (query.userId) {
            for (const item of items) {
                const { status } = await this.LikesRepository.getUserLikeEntityAndStatus(item._id, query.userId)

                const newestLikes = await this.LikesRepository.getNewestLikesFromEntity(item._id)

                itemsWithStatuses.push(new PostViewDto(item, status, newestLikes))

            }
        } else {
            for (const item of items) {
                const newestLikes = await this.LikesRepository.getNewestLikesFromEntity(item._id)

                itemsWithStatuses.push(new PostViewDto(item, LikeStatus.None, newestLikes))
            }
        }

        return PaginatedViewDto.mapToView({
            items: itemsWithStatuses,
            page: query.query.pageNumber,
            size: query.query.pageSize,
            totalCount: totalCount
        })
    }
}