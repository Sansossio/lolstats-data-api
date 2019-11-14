import { ITFTMatchModel } from '../../../tft-match/models/match/tft-match.interface'
import { findSummoner } from '../tft'

export function keyAverage (puuid: string, matches: Partial<ITFTMatchModel>[], key: string) {
  let total = 0
  if (!matches.length) {
    return 0
  }
  for (const match of matches) {
    let value = findSummoner(puuid, match.participants || [])[key] as number
    if (!value) {
      value = 0
    }
    total += value
  }
  return total / matches.length
}
