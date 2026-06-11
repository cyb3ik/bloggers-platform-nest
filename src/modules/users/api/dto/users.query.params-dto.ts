import { BaseQueryParams } from "../../../../core/dto/query.params.input-dto";

enum UsersSortBy {
    id = 'id',
    login = 'login',
    email = 'email',
    createdAt = 'createdAt'
}

export class UsersQueryParams extends BaseQueryParams {
    sortBy = UsersSortBy.createdAt
    searchLoginTerm: string | null = null
    searchEmailTerm: string | null = null
}