import { UserDocument } from '../../domain/user.entity';

export class UserViewDto {
    id: string
    login: string
    email: string
    createdAt: Date

    constructor(user: UserDocument) {
        this.id = user._id.toString()
        this.login = user.login
        this.email = user.email
        this.createdAt = user.createdAt
    }
}