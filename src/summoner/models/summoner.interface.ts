import { Document } from 'mongoose'
import { Regions } from 'api-riot-games/dist/constants'

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
  matchs: Map<string, boolean>
}
