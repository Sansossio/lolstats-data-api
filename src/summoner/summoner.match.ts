import { SummonerV4DTO } from 'api-riot-games/dist/dto'
import { ISummonerModel } from './models/summoner.interface'
import { Regions } from 'api-riot-games/dist/constants'
import { ISummonerLeagueModel } from '../summoner-leagues/models/summoner-leagues.interface'

export function matchLeagues (leagues: Partial<ISummonerLeagueModel>[]) {
  const response = new Map()
  for (const league of leagues) {
    response.set(league.queueType, league)
  }
  return response
}

export function riotToModel (
  riot: SummonerV4DTO,
  leagues: Partial<ISummonerLeagueModel>[],
  region: Regions
): Partial<ISummonerModel> {
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
    leagues: matchLeagues(leagues),
    region
  }
}
