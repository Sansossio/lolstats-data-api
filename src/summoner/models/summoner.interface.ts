import { Regions } from 'twisted/dist/constants'
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
  lolMatches: Map<string, boolean>,
  tftMatches: Map<string, boolean>
  leagues: Map<string, Partial<ISummonerLeagueModel>>
}
