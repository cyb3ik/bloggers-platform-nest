import { CreateUserInputDto } from "../../../api/dto/users.input-dto";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UsersService } from "../../users.service";
import { UsersRepository } from "../../../infrastructure/users.repository";
import { UsersConfig } from "../../../users.config";
import { InjectModel } from "@nestjs/mongoose";
import { User, type UserModelType } from "../../../domain/user.entity";


export class CreateUserCommand {
    constructor(public readonly dto: CreateUserInputDto) { }
}

@CommandHandler(CreateUserCommand)
export class CreateUserUseCase
    implements ICommandHandler<CreateUserCommand> {
    constructor(
        @InjectModel(User.name)
        private readonly UserModel: UserModelType,
        private readonly UsersService: UsersService,
        private readonly UsersRepository: UsersRepository,
        private readonly UsersConfig: UsersConfig
    ) { }

    async execute({ dto }: CreateUserCommand): Promise<string> {

        await this.UsersService.checkIfUserIsUnique(dto.email, dto.login)

        const passwordInfo = await this.UsersService.generatePasswordHashAndSalt(dto.password)

        const userDomainDto = {
            email: dto.email,
            login: dto.login,
            passwordSalt: passwordInfo.passwordSalt,
            passwordHash: passwordInfo.passwordHash,
            isConfirmed: this.UsersConfig.isUserAutoConfirmed
        }

        const user = this.UserModel.createInstance(userDomainDto)

        await this.UsersRepository.save(user)

        return user._id.toString()
    }
}