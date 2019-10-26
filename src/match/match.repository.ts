import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { MatchEntity } from './entities/match.entity'
import { DBConnection } from '../enum/database-connection.enum'
import { Repository } from 'typeorm'
import { MatchParticipantsEntity } from './entities/match.participants.entity'

@Injectable()
export class MatchRepositories {
  constructor (
    @InjectRepository(MatchEntity, DBConnection.CONTEXT)
    readonly matches: Repository<MatchEntity>,
    @InjectRepository(MatchParticipantsEntity, DBConnection.CONTEXT)
    readonly matchesParticipants: Repository<MatchParticipantsEntity>
  ) {}
}
