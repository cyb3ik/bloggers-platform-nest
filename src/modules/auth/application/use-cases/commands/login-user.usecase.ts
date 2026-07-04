import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { LoginInputDto } from "../../../api/dto/login.input-dto";
import { JwtService } from "@nestjs/jwt";
import { AuthService } from "../../auth.service";
import { Response } from "express";
import { Inject } from "@nestjs/common";
import { ACCESS_TOKEN_STRATEGY_INJECT_TOKEN, REFRESH_TOKEN_STRATEGY_INJECT_TOKEN } from "../../../../../core/constants/jwt-tokens";


export class LoginUserCommand {
    constructor(
        public readonly dto: LoginInputDto,
        public readonly res: Response
    ) { }
}

@CommandHandler(LoginUserCommand)
export class LoginUserUseCase
    implements ICommandHandler<LoginUserCommand> {
    constructor(
        @Inject(ACCESS_TOKEN_STRATEGY_INJECT_TOKEN)
        private readonly AccessTokenService: JwtService,

        @Inject(REFRESH_TOKEN_STRATEGY_INJECT_TOKEN)
        private readonly RefreshTokenService: JwtService,

        private readonly AuthService: AuthService,
    ) { }

    async execute({ dto, res }: LoginUserCommand): Promise<{ accessToken: string }> {

        const user = await this.AuthService.checkCredentials(dto)

        const accessToken = this.AccessTokenService.sign({ id: user._id.toString() })

        const refreshToken = this.RefreshTokenService.sign({ id: user._id.toString() })

        res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true })

        return { accessToken: accessToken }
    }
}