import { IBaseInterface } from '../../base/base.interface'

export interface ISummonerLeagueModel extends IBaseInterface {
  queueType: string
  summonerName: string
  hotStreak: boolean
  wins: number
  veteran: boolean
  losses: number
  rank: number
  leagueId: string
  inactive: boolean
  freshBlood: boolean
  tier: string
  summonerId: string
  leaguePoints: number
  summoner?: string
  createdAt: Date
  updatedAt: Date
}
