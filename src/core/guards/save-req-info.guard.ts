import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { RequestsRepository } from "../requests/requests.repository";

@Injectable()
export class SaveReqInfoGuard implements CanActivate {
    constructor(
        private readonly RequestsRepository: RequestsRepository
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {

        const req = context.switchToHttp().getRequest()

        const request = {
            ip: req.ip!,
            url: req.originalUrl,
            date: new Date()
        }

        await this.RequestsRepository.saveNewRequest(request)

        return true
    }
}