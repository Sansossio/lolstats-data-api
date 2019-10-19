import { Injectable, NotFoundException } from '@nestjs/common'
import { RiotApiService } from 'src/riot-api/riot-api.service'
import { SummonerGetDTO } from './dto/summoner.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { SummonerEntity } from './summoner.entity'
import { Repository } from 'typeorm'
import { SummonerV4DTO } from 'api-riot-games/dist/dto/Summoner/Summoner.dto'
import { Regions } from 'api-riot-games/dist/constants'

@Injectable()
export class SummonerService {
  private readonly api = this.riot.getLolApi().summoner

  constructor (
    @InjectRepository(SummonerEntity)
    private readonly repository: Repository<SummonerEntity>,
    private readonly riot: RiotApiService
  ) {}

  async save (instance: SummonerV4DTO, region: Regions) {
    const save: SummonerEntity = {
      ...instance,
      region
    }
    return this.repository.save(save)
  }

  async get (params: SummonerGetDTO) {
    // Search in database
    const search = await this.repository.findOne({
      where: {
        name: params.summonerName,
        region: params.regions
      }
    })
    if (search) {
      return search
    }
    // Search in riot api
    try {
      const { response } = await this.api.getByName(params.summonerName, params.regions)
      return this.save(response, params.regions)
    } catch (e) {
      throw new NotFoundException()
    }
  }
}
