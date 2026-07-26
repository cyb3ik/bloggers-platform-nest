import { SessionDocument } from "../../../../modules/sessions/session.entity";
import { BaseRepository } from "../base-repository.interface";

export interface ISessionsRepository extends BaseRepository<SessionDocument> {
    findAllUserSessions(userId: string): Promise<SessionDocument[]>

    findSessionByDeviceId(deviceId: string): Promise<SessionDocument>

    deleteSpecifiedDeviceSession(userId: string, deviceId: string): Promise<void>

    deleteAllUserSessionsExceptCurrent(userId: string, deviceId: string): Promise<void>

    findSession(userId: string, deviceId: string, iat: number): Promise<SessionDocument>
}