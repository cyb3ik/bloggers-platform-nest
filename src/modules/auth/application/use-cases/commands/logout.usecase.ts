import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { SessionsRepository } from "../../../../sessions/sessions.repository";
import { SessionInfo } from "../../../../sessions/dto/session-info.dto";


export class LogoutCommand {
    constructor(
        public readonly session: SessionInfo
    ) { }
}

@CommandHandler(LogoutCommand)
export class LogoutUseCase
    implements ICommandHandler<LogoutCommand> {
    constructor(
        private readonly SessionsRepository: SessionsRepository,
    ) { }

    async execute({ session }: LogoutCommand) {

        const userId = session.userId
        const deviceId = session.deviceId

        await this.SessionsRepository.deleteSpecifiedDeviceSession(userId, deviceId)
    }
}