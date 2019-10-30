import { SummonerV4DTO } from 'api-riot-games/dist/dto'
import { ISummonerModel } from './models/summoner.interface'
import { Regions } from 'api-riot-games/dist/constants'

export function riotToModel (riot: SummonerV4DTO, region: Regions): Partial<ISummonerModel> {
  return {
    name: riot.name,
    profileIconId: riot.profileIconId,
    summonerLevel: riot.summonerLevel,
    revisionDate: riot.revisionDate,
    id: riot.id,
    accountId: riot.accountId,
    puuid: riot.puuid,
    loading: false,
    bot: false,
    matchs: new Map(),
    region
  }
}
