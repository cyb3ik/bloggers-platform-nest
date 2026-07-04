import { InjectModel } from "@nestjs/mongoose";
import { CreateUserInputDto } from "../../../api/dto/users.input-dto";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Types } from "mongoose";
import { User, type UserModelType } from "../../../domain/user.entity";
import { UsersService } from "../../users.service";
import { UsersRepository } from "../../../infrastructure/users.repository";
import { BcryptService } from "../../bcrypt.service";


export class CreateUserCommand {
    constructor(public readonly dto: CreateUserInputDto) { }
}

@CommandHandler(CreateUserCommand)
export class CreateUserUseCase
    implements ICommandHandler<CreateUserCommand, Types.ObjectId> {
    constructor(
        @InjectModel(User.name)
        private readonly UserModel: UserModelType,
        private readonly UsersService: UsersService,
        private readonly UsersRepository: UsersRepository,
        private readonly CryptoService: BcryptService,
    ) { }

    async execute({ dto }: CreateUserCommand): Promise<Types.ObjectId> {

        await this.UsersService.checkIfUserIsUnique(dto.email, dto.login)

        const passwordSalt = await this.CryptoService.generateSalt(10)
        const passwordHash = await this.CryptoService.generateHash(dto.password, passwordSalt)

        const user = this.UserModel.createInstance({
            email: dto.email,
            login: dto.login,
            passwordSalt: passwordSalt,
            passwordHash: passwordHash
        })
        //TODO change behaviour based on current role - admin or user
        //user.setEmailConfirmationStatus(true)

        await this.UsersRepository.save(user)

        return user._id
    }
}