import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';
import { PaginatedViewDto } from '../../../../../../core/dto/paginated.view-dto';
import { PostViewDto } from '../../../api/dto/posts.view-dto';
import { PostsQueryParams } from '../../../api/dto/posts.query.params-dto';
import { PostsQueryRepository } from '../../../infrastructure/posts.query.repository';
import { LikesRepository } from '../../../../likes/repositories/likes-repository';
import { LikeStatus } from '../../../../likes/dto/like.raw-dto';

export class FindAllPostsQuery extends Query<PaginatedViewDto<PostViewDto[]>> {
    constructor(
        public readonly query: PostsQueryParams,
        public readonly userId?: string
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
        const result = await this.PostsQueryRepository.getAllEntities(query.query)

        for (const item of result.items) {
            let status = LikeStatus.None

            if (query.userId) {
                const like = await this.LikesRepository.findLikeByUserId(item.id, query.userId)

                if (like) {
                    status = like.status
                }
            }

            const { likesCount, dislikesCount } = await this.LikesRepository.getLikesAndDislikesCount(item.id)

            const newestLikes = await this.LikesRepository.getNewestLikesFromEntity(item.id)

            item.addLikesInfo(likesCount, dislikesCount, status, newestLikes)
        }

        return result
    }
}