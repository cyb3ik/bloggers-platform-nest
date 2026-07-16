import { Query } from '@nestjs/cqrs';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { SessionInfo } from '../../dto/session-info.dto';
import { SessionViewDto } from '../../dto/session.view-dto';
import { SessionsRepository } from '../../sessions.repository';

export class FindAllUserSessionsQuery extends Query<SessionViewDto[]> {
    constructor(
        public readonly session: SessionInfo
    ) {
        super()
    }
}

@QueryHandler(FindAllUserSessionsQuery)
export class FindAllUserSessionsQueryHandler implements IQueryHandler<FindAllUserSessionsQuery> {
    constructor(
        private readonly SessionsRepository: SessionsRepository) { }

    async execute(query: FindAllUserSessionsQuery): Promise<SessionViewDto[]> {
        const userId = query.session.userId

        const sessions = await this.SessionsRepository.findAllUserSessions(userId)

        return sessions.map(s => new SessionViewDto(s))
    }
}