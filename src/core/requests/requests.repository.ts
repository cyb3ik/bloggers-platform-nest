import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Request, RequestDocument, type RequestModelType } from "./request.entity";
import { add } from "date-fns/add";

@Injectable()
export class RequestsRepository {
    constructor(
        @InjectModel(Request.name) private readonly RequestModel: RequestModelType
    ) { }

    async getRequestsRate(ip: string, url: string, date: Date) {
        const rate = await this.RequestModel.countDocuments({
            ip: ip,
            url: url,
            date: {
                $gte: add(date, {
                    seconds: -10
                })
            }
        })
        return rate
    }

    async saveNewRequest(dto: { ip: string, url: string, date: Date }) {
        const req = this.RequestModel.createInstance(dto)

        await req.save()
    }
}