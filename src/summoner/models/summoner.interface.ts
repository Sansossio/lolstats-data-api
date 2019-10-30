import { Document } from 'mongoose'
import { Regions } from 'api-riot-games/dist/constants'
import { ISummonerLeagueModel } from '../../summoner-leagues/models/summoner-leagues.interface'

export interface ISummonerModel extends Document {
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
  matchs: Map<string, boolean>,
  leagues: Map<string, Partial<ISummonerLeagueModel>>
  createdAt: Date
  updatedAt: Date
}
