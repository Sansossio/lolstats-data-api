import { Regions } from 'api-riot-games/dist/constants'
import { ISummonerLeagueModel } from '../../summoner-leagues/models/summoner-leagues.interface'
import { IBaseInterface } from '../../base/base.interface'

export interface ISummonerModel extends IBaseInterface {
  name: string
  profileIconId: number
  summonerLevel: number
  revisionDate: number
  id: string
  puuid: string
  accountId: string
  loading?: boolean
  bot?: boolean
  region: Regions
  matches: Map<string, boolean>,
  leagues: Map<string, Partial<ISummonerLeagueModel>>
}
