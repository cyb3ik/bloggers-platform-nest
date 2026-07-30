import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';
import { PaginatedViewDto } from '../../../../../../core/dto/paginated.view-dto';
import { PostsQueryRepository } from '../../../../posts/infrastructure/posts.query.repository';
import { PostViewDto } from '../../../../posts/api/dto/posts.view-dto';
import { NotFoundException } from '@nestjs/common';
import { PostsQueryParams } from '../../../../posts/api/dto/posts.query.params-dto';
import { LikesRepository } from '../../../../likes/repositories/likes-repository';
import { BlogsRepository } from '../../../infrastructure/blogs.repository';
import { LikeStatus } from '../../../../likes/dto/like.raw-dto';

export class FindAllPostsFromBlogQuery extends Query<PaginatedViewDto<PostViewDto[]>> {
    constructor(
        public readonly blogId: string,
        public readonly query: PostsQueryParams,
        public readonly userId?: string,
    ) {
        super()
    }
}

@QueryHandler(FindAllPostsFromBlogQuery)
export class FindAllPostsFromBlogQueryHandler implements IQueryHandler<FindAllPostsFromBlogQuery> {
    constructor(
        private readonly BlogsRepository: BlogsRepository,
        private readonly PostsQueryRepository: PostsQueryRepository,
        private readonly LikesRepository: LikesRepository
    ) { }

    async execute(query: FindAllPostsFromBlogQuery): Promise<PaginatedViewDto<PostViewDto[]>> {
        const blog = await this.BlogsRepository.findEntityById(query.blogId)

        if (!blog) {
            throw new NotFoundException('Blog not found')
        }

        const result = await this.PostsQueryRepository.getAllPostsFromBlog(query.blogId, query.query)

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