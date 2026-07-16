import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { RequestsRepository } from "../requests/requests.repository";

@Injectable()
export class RateLimitGuard implements CanActivate {

    constructor(
        private readonly RequestsRepository: RequestsRepository
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {

        const req = context.switchToHttp().getRequest()

        const currentDate = new Date()

        const rate = await this.RequestsRepository.getRequestsRate(req.ip, req.originalUrl, currentDate)

        if (rate > 5) {
            throw new HttpException('Too many requests!', HttpStatus.TOO_MANY_REQUESTS)
        }

        return true
    }
}