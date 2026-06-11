import { BaseQueryParams } from "../../../../../core/dto/query.params.input-dto";

enum BlogsSortBy {
    id = 'id',
    name = 'name',
    description = 'description',
    websiteUrl = 'websiteUrl',
    createdAt = 'createdAt',
    isMembership = 'isMembership'
}

export class BlogsQueryParams extends BaseQueryParams {
    sortBy = BlogsSortBy.createdAt
}