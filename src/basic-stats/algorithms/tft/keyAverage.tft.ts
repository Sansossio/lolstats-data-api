import { ITFTMatchModel } from '../../../tft-match/models/match/tft-match.interface'
import { findSummoner } from '.'

export function keyAverage (puuid: string, matches: Partial<ITFTMatchModel>[], key: string) {
  let total = 0
  for (const match of matches) {
    const value = findSummoner(puuid, match.participants || [])[key] as number
    total += value || 0
  }
  return total / matches.length
}
