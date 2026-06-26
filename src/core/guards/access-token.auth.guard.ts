import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../../modules/users/application/users.service";
import { UsersRepository } from "../../modules/users/infrastructure/users.repository";

@Injectable()
export class AccessTokenAuthGuard implements CanActivate {

    constructor(
        private readonly JwtService: JwtService,
        private readonly UsersRepository: UsersRepository
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        //TODO check how to change stupid try/catch
        try {
            const req = context.switchToHttp().getRequest()
            const authHeader = req.headers.authorization

            if (!authHeader) {
                throw new UnauthorizedException()
            }

            const [authType, token] = authHeader.split(' ')
            if (authType !== 'Bearer') {
                throw new UnauthorizedException()
            }

            const payload = await this.JwtService.verify(token)

            req.user = await this.UsersRepository.findUserByIdOrFail(payload.id)

            return true
        } catch (e) {
            throw new UnauthorizedException()
        }
    }
}