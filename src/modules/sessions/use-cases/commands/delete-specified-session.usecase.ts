import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { SessionInfo } from "../../dto/session-info.dto";
import { SessionsRepository } from "../../sessions.repository";
import { ForbiddenException, NotFoundException } from "@nestjs/common";

export class DeleteSpecifiedSessionCommand {
    constructor(
        public readonly sessionInfo: SessionInfo,
        public readonly deviceId: string
    ) { }
}

@CommandHandler(DeleteSpecifiedSessionCommand)
export class DeleteSpecifiedSessionUseCase
    implements ICommandHandler<DeleteSpecifiedSessionCommand> {
    constructor(
        private readonly SessionsRepository: SessionsRepository
    ) { }

    async execute({ sessionInfo, deviceId }: DeleteSpecifiedSessionCommand) {

        const userId = sessionInfo.userId

        const session = await this.SessionsRepository.findSessionByDeviceId(deviceId)

        if (!session) {
            throw new NotFoundException('Session was not found')
        }

        if (session.userId !== userId) {
            throw new ForbiddenException()
        }

        await this.SessionsRepository.deleteSpecifiedDeviceSession(userId, deviceId)
    }
}