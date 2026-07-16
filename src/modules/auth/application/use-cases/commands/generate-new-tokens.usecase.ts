import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { LoginInputDto } from "../../../api/dto/login.input-dto";
import { JwtService } from "@nestjs/jwt";
import { AuthService } from "../../auth.service";
import { Request, Response } from "express";
import { Inject } from "@nestjs/common";
import { ACCESS_TOKEN_STRATEGY_INJECT_TOKEN, REFRESH_TOKEN_STRATEGY_INJECT_TOKEN } from "../../../../../core/constants/jwt-tokens";
import { randomUUID } from "crypto";
import { CreateSessionDto } from "../../../../sessions/dto/create-session.dto";
import { SessionsRepository } from "../../../../sessions/sessions.repository";
import { SessionInfo } from "../../../../sessions/dto/session-info.dto";


export class GenerateNewTokensCommand {
    constructor(
        public readonly session: SessionInfo,
        public readonly res: Response
    ) { }
}

@CommandHandler(GenerateNewTokensCommand)
export class GenerateNewTokensUseCase
    implements ICommandHandler<GenerateNewTokensCommand> {
    constructor(
        @Inject(ACCESS_TOKEN_STRATEGY_INJECT_TOKEN)
        private readonly AccessTokenService: JwtService,

        @Inject(REFRESH_TOKEN_STRATEGY_INJECT_TOKEN)
        private readonly RefreshTokenService: JwtService,

        private readonly SessionsRepository: SessionsRepository,
    ) { }

    async execute({ session, res }: GenerateNewTokensCommand) {

        const userId = session.userId
        const deviceId = session.deviceId

        const accessToken = this.AccessTokenService.sign({ id: userId })

        const refreshToken = this.RefreshTokenService.sign({ id: userId, deviceId: deviceId })

        const refreshTokenPayload = await this.RefreshTokenService.verify(refreshToken)

        await this.SessionsRepository.updateSessionInformation(userId, deviceId, refreshTokenPayload.iat)

        res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true })

        return { accessToken: accessToken }
    }
}