import { SummonerV4DTO } from 'api-riot-games/dist/dto'
import { ISummonerModel } from './models/summoner.interface'
import { Regions } from 'api-riot-games/dist/constants'
import { ISummonerLeagueModel } from '../summoner-leagues/models/summoner-leagues.interface'

export enum SummonerUtilsEnum {
  BOT_TAG = '0',
  BOT_NAME = 'Bot'
}

export function matchLeagues (leagues: Partial<ISummonerLeagueModel>[]) {
  const response = new Map()
  for (const league of leagues) {
    response.set(league.queueType, league)
  }
  return response
}

export function isBot (accountId: string | undefined) {
  return accountId === SummonerUtilsEnum.BOT_TAG
}

export function parseAccountId (accountId: string) {
  if (isBot(accountId)) {
    return undefined
  }
  return accountId
}

export function riotToModel (
  riot: SummonerV4DTO,
  leagues: Partial<ISummonerLeagueModel>[],
  region: Regions,
  loading: boolean
): Partial<ISummonerModel> {
  return {
    name: riot.name,
    profileIconId: riot.profileIconId,
    summonerLevel: riot.summonerLevel,
    revisionDate: riot.revisionDate,
    id: riot.id,
    accountId: riot.accountId,
    puuid: riot.puuid,
    bot: isBot(riot.accountId),
    lolMatches: new Map(),
    tftMatches: new Map(),
    leagues: matchLeagues(leagues),
    loading,
    region
  }
}
