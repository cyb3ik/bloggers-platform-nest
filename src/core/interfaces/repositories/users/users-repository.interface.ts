import { UserDocument } from "../../../../modules/users/domain/user.entity";
import { BaseRepository } from "../base-repository.interface";

export interface IUsersRepository extends BaseRepository<UserDocument> {
    findUserByEmail(email: string): Promise<UserDocument | null>

    findUserByLogin(login: string): Promise<UserDocument | null>

    findUserByConfirmationCode(code: string): Promise<UserDocument | null>

    findUserByRecoveryCode(code: string): Promise<UserDocument | null>
}