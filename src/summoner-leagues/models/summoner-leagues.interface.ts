import { Document } from 'mongoose'
import { SummonerLeagueDto } from 'api-riot-games/dist/dto'

export interface ISummonerLeagueModel extends SummonerLeagueDto, Document {
  summoner: String
}
