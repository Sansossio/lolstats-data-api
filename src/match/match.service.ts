import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { SummonerMatchesEntity } from './entities/summoner-matches.entity'
import { DBConnection } from '../enum/database-connection.enum'
import { Repository } from 'typeorm'
import { SummonerMatchesFindBySummoner, SummonerMatchesFindBySummonerResponse } from './dto/summoner-matches.dto'

@Injectable()
export class MatchService {
  constructor (
    @InjectRepository(SummonerMatchesEntity, DBConnection.CONTEXT)
    private readonly repository: Repository<SummonerMatchesEntity>
  ) {}

  async getByUser ({ idSummoner }: SummonerMatchesFindBySummoner): Promise<SummonerMatchesFindBySummonerResponse> {
    const [matches, total] = await this.repository.findAndCount({
      where: {
        idSummoner
      }
    })
    return {
      total,
      matches
    }
  }
}
