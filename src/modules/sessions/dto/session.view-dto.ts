import { SessionDocument } from '../session.entity';

export class SessionViewDto {
    ip: string
    title: string
    lastActiveDate: string
    deviceId: string

    constructor(session: SessionDocument) {
        this.ip = session.ip
        this.title = session.title
        this.lastActiveDate = new Date(Number(session.lastActiveDate) * 1000).toISOString()
        this.deviceId = session.deviceId
    }
}