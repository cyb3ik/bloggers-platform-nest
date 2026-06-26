import { UserDocument } from "../../../../users/domain/user.entity"

export class MePageView {
    email: string
    login: string
    userId: string

    constructor(user: UserDocument) {
        this.userId = user._id.toString()
        this.login = user.login
        this.email = user.email
    }
}