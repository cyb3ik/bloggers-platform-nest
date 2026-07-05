import { CanActivate, ExecutionContext, ForbiddenException, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersRepository } from "../../modules/users/infrastructure/users.repository";
import { ACCESS_TOKEN_STRATEGY_INJECT_TOKEN } from "../constants/jwt-tokens";

@Injectable()
export class OptionalAccessTokenAuthGuard implements CanActivate {

    constructor(
        @Inject(ACCESS_TOKEN_STRATEGY_INJECT_TOKEN)
        private readonly JwtService: JwtService,
        private readonly UsersRepository: UsersRepository
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        //TODO check how to change stupid try/catch
        try {
            const req = context.switchToHttp().getRequest()
            const authHeader = req.headers.authorization

            if (!authHeader) {
                req.user = null
                return true
            }

            const [authType, token] = authHeader.split(' ')

            if (authType !== 'Bearer') {
                req.user = null
                return true
            }

            const payload = await this.JwtService.verify(token)

            const user = await this.UsersRepository.findUserById(payload.id)

            if (!user) {
                throw new UnauthorizedException()
            }

            req.user = {
                id: user._id,
                login: user.login
            }

            return true
        } catch (e) {
            throw new UnauthorizedException()
        }
    }
}