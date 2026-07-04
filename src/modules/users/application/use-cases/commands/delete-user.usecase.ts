import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Types } from "mongoose";
import { UsersRepository } from "../../../infrastructure/users.repository";
import { NotFoundException } from "@nestjs/common";


export class DeleteUserCommand {
    constructor(public readonly userId: Types.ObjectId) { }
}

@CommandHandler(DeleteUserCommand)
export class DeleteUserUseCase
    implements ICommandHandler<DeleteUserCommand> {
    constructor(
        private readonly UsersRepository: UsersRepository,
    ) { }

    async execute({ userId }: DeleteUserCommand): Promise<void> {

        const user = await this.UsersRepository.findUserById(userId)

        if (!user) {
            //TODO: replace with domain exception
            throw new NotFoundException('User not found')
        }

        await this.UsersRepository.delete(user)

        await this.UsersRepository.save(user)
    }
}