import { BaseQueryParams } from "../../../../../core/dto/query.params.input-dto";

enum PostsSortBy {
    id = 'id',
    title = 'title',
    shortDescription = 'shortDescription',
    content = 'content',
    blogId = 'blogId',
    blogName = 'blogName',
    createdAt = 'createdAt',
    extendedLikesInfo = 'extendedLikesInfo'
}

export class PostsQueryParams extends BaseQueryParams {
    sortBy = PostsSortBy.createdAt
}