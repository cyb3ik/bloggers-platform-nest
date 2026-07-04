import { Injectable } from "@nestjs/common";
import { UsersQueryRepository } from "../../users/infrastructure/users.query.repository";
import { Types } from "mongoose";
import { MePageView } from "../api/dto/view/me-page-view.dto";
import { UsersRepository } from "../../users/infrastructure/users.repository";

@Injectable()
export class AuthQueryRepository {
    constructor(
        private readonly UsersRepository: UsersRepository
    ) { }
    async getMePage(id: Types.ObjectId) {
        const user = await this.UsersRepository.findUserById(
            id
        )

        if (!user) {
            return null
        }

        return new MePageView(user)
    }
}