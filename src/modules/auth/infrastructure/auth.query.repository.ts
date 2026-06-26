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
    async getMePage(id: string) {
        const user = await this.UsersRepository.findUserByIdOrFail(
            new Types.ObjectId(id)
        )

        return new MePageView(user)
    }
}