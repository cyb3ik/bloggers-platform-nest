import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';
import { PaginatedViewDto } from '../../../../../../core/dto/paginated.view-dto';
import { BlogsQueryRepository } from '../../../infrastructure/blogs.query.repository';
import { PostsQueryRepository } from '../../../../posts/infrastructure/posts.query.repository';
import { PostViewDto } from '../../../../posts/api/dto/posts.view-dto';
import { Types } from 'mongoose';
import { NotFoundException } from '@nestjs/common';
import { PostsQueryParams } from '../../../../posts/api/dto/posts.query.params-dto';
import { LikesRepository } from '../../../../likes/repositories/likes-repository';

export class FindAllPostsFromBlogQuery extends Query<PaginatedViewDto<PostViewDto[]>> {
    constructor(
        public readonly blogId: Types.ObjectId,
        public readonly query: PostsQueryParams,
        public readonly userId?: Types.ObjectId,
    ) {
        super()
    }
}

@QueryHandler(FindAllPostsFromBlogQuery)
export class FindAllPostsFromBlogQueryHandler implements IQueryHandler<FindAllPostsFromBlogQuery> {
    constructor(
        private readonly BlogsQueryRepository: BlogsQueryRepository,
        private readonly PostsQueryRepository: PostsQueryRepository,
        private readonly LikesRepository: LikesRepository
    ) { }

    async execute(query: FindAllPostsFromBlogQuery): Promise<PaginatedViewDto<PostViewDto[]>> {
        const blog = await this.BlogsQueryRepository.findBlogById(query.blogId)

        if (!blog) {
            throw new NotFoundException('Blog not found')
        }

        const { items, totalCount } = await this.PostsQueryRepository.findAllPostsFromBlog(query.blogId, query.query)

        const itemsWithStatuses = []

        for (const item of items) {
            const { status } = await this.LikesRepository.getUserLikeEntityAndStatus(item._id, query.userId)

            const newestLikes = await this.LikesRepository.getNewestLikesFromEntity(item._id)

            itemsWithStatuses.push(new PostViewDto(item, status, newestLikes))
        }

        return PaginatedViewDto.mapToView({
            items: itemsWithStatuses,
            page: query.query.pageNumber,
            size: query.query.pageSize,
            totalCount: totalCount
        })
    }
}