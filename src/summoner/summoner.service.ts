import { Injectable, NotFoundException } from '@nestjs/common'
import { RiotApiService } from 'src/riot-api/riot-api.service'
import { SummonerGetDTO } from './dto/summoner.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { SummonerEntity } from './summoner.entity'
import { Repository } from 'typeorm'

@Injectable()
export class SummonerService {
  private readonly api = this.riot.getLolApi()

  constructor (
    @InjectRepository(SummonerEntity)
    private readonly repository: Repository<SummonerEntity>,
    private readonly riot: RiotApiService
  ) {}

  private async getSummonerInfo (params: SummonerGetDTO): Promise<SummonerEntity> {
    // Search summoner
    const {
      response: summoner
    } = await this.api.summoner.getByName(params.summonerName, params.region)
    // Search summoner leagues
    const {
      response: leagues
    } = await this.api.league.bySummoner(summoner.id, params.region)

    const response = this.repository.create({
      ...summoner,
      region: params.region,
      leagues
    })

    return response
  }

  async get (params: SummonerGetDTO) {
    // Search in database
    const search = await this.repository.findOne({
      where: {
        name: params.summonerName,
        region: params.region
      },
      relations: ['leagues']
    })
    if (search) {
      return search
    }
    // Search in riot api
    try {
      const userInfo = await this.getSummonerInfo(params)
      return this.repository.save(userInfo)
    } catch (e) {
      throw new NotFoundException()
    }
  }
}
