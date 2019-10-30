import { Regions } from 'api-riot-games/dist/constants'
import { ISummonerLeagueModel } from '../../summoner-leagues/models/summoner-leagues.interface'
import { IBaseInterface } from '../../base/base.interface'

export interface ISummonerModel extends IBaseInterface {
  name: String
  profileIconId: Number
  summonerLevel: Number
  revisionDate: Number
  id: String
  puuid: String
  accountId: String
  loading?: Boolean
  bot?: Boolean
  region: Regions
  matches: Map<string, boolean>,
  leagues: Map<string, Partial<ISummonerLeagueModel>>
}
