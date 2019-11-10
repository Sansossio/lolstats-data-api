import { IBaseInterface } from '../../../base/base.interface'

export interface ITftSummonerStatsModel extends IBaseInterface {
  name: string
  conditional?: string
  summoner: string
  queue: number
  games: number
  winrate: number
  playersEliminated: number
  placements: {
    placement: number
    percentage: number
    total: number
  }[]
  averages: {
    goldLeft: number
    level: number
    lastRound: number
  }
  mostUsed: {
    traits: {
      name: string
      num_units: number
      games: number
    }[]
    units: {
      name: string
      character_id?: string
      games: number
      tier: number
    }[]
  }
}
