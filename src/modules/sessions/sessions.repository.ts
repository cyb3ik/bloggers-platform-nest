import { Injectable } from "@nestjs/common";
import { Session, type SessionModelType } from "./session.entity";
import { InjectModel } from "@nestjs/mongoose";
import { CreateSessionDto } from "./dto/create-session.dto";

@Injectable()
export class SessionsRepository {
    constructor(
        @InjectModel(Session.name)
        private readonly SessionModel: SessionModelType,
    ) { }

    async addNewSession(sessionInfo: CreateSessionDto) {
        const session = this.SessionModel.createInstance(sessionInfo)

        await session.save()
    }

    async findAllUserSessions(userId: string) {
        const userSessions = await this.SessionModel.find({ userId: userId }).exec()

        return userSessions
    }

    async findSessionByDeviceId(deviceId: string) {
        const deviceSession = await this.SessionModel.findOne({ deviceId: deviceId })

        return deviceSession
    }

    async updateSessionInformation(userId: string, deviceId: string, timestamp: string) {
        await this.SessionModel.updateOne({
            userId: userId,
            deviceId: deviceId
        },
            {
                $set: {
                    lastActiveDate: timestamp
                }
            })
        return
    }

    async deleteSpecifiedDeviceSession(userId: string, deviceId: string) {
        await this.SessionModel.deleteOne({
            userId: userId,
            deviceId: deviceId
        })

        return
    }

    async deleteAllUserSessionsExceptCurrent(userId: string, deviceId: string) {
        await this.SessionModel.deleteMany({
            userId: userId,
            deviceId: { $ne: deviceId }
        })
        return
    }

    async findSession(userId: string, deviceId: string, iat: number) {
        const activeSession = await this.SessionModel.findOne({
            userId: userId,
            deviceId: deviceId,
            lastActiveDate: iat
        })

        return activeSession
    }
}