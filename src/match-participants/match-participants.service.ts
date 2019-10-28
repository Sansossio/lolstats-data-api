import { Injectable, Inject, InternalServerErrorException } from '@nestjs/common'
import { MatchParticipantsEntity } from '../database/entities/entities/match.participants.entity'
import { FindOptions, Transaction } from 'sequelize/types'
import { merge } from 'lodash'
import { RepositoriesName } from '../database/database.enum'

@Injectable()
export class MatchParticipantsService {
  constructor (
    @Inject(RepositoriesName.MATCH_PARTICIPANTS)
    private readonly repository: typeof MatchParticipantsEntity
  ) {}

  async create (summonerId?: number, matchId?: number, transaction?: Transaction) {
    if (!summonerId || !matchId) {
      throw new InternalServerErrorException('Invalid match participants params')
    }
    return this.repository.create({ summonerId, matchId }, { transaction })
  }

  async getMatchesBySummoner (summonerId?: number, options?: FindOptions) {
    if (!summonerId) {
      return []
    }
    options = merge(options || {}, {
      where: {
        summonerId
      },
      include: ['match']
    })
    const matches = await this.findAll(options)
    return matches.map(match => match.match)
  }

  async findAll (options?: FindOptions) {
    options = options || {}
    return this.repository.findAll(options)
  }
}
