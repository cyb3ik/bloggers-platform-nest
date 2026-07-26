import { Injectable } from "@nestjs/common";
import { Session, SessionDocument, type SessionModelType } from "./session.entity";
import { InjectModel } from "@nestjs/mongoose";
import { CreateSessionDto } from "./dto/create-session.dto";
import { ISessionsRepository } from "../../core/interfaces/repositories/sessions/sessions-repository.interface";
import { Document, Types } from "mongoose";
import { SessionViewDto } from "./dto/session.view-dto";

@Injectable()
export class SessionsRepository implements ISessionsRepository {
    constructor(
        @InjectModel(Session.name)
        private readonly SessionModel: SessionModelType,
    ) { }

    async save(session: SessionDocument) {
        await session.save()
    }

    async findEntityById(id: string): Promise<SessionDocument | null> {
        const session = await this.SessionModel.findOne({
            _id: id
        })

        if (!session) {
            return null
        }

        return session
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