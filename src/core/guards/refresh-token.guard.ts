import { CanActivate, ExecutionContext, ForbiddenException, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersRepository } from "../../modules/users/infrastructure/users.repository";
import { REFRESH_TOKEN_STRATEGY_INJECT_TOKEN } from "../constants/jwt-tokens";

@Injectable()
export class RefreshTokenGuard implements CanActivate {

    constructor(
        @Inject(REFRESH_TOKEN_STRATEGY_INJECT_TOKEN)
        private readonly JwtService: JwtService,
        private readonly UsersRepository: UsersRepository
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        //TODO check how to change stupid try/catch
        try {
            const req = context.switchToHttp().getRequest()

            if (!req.cookies.refreshToken) {
                throw new UnauthorizedException()
            }

            const token = String(req.cookies.refreshToken)

            const payload = await this.JwtService.verify(token)

            const user = await this.UsersRepository.findUserById(payload.userId)

            if (!user) {
                throw new ForbiddenException()
            }

            req.user = {
                id: user._id.toString(),
                login: user.login
            }

            return true
        }
        catch {
            throw new UnauthorizedException()
        }
    }
}