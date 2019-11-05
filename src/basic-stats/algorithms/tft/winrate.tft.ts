import { ITFTMatchModel } from '../../../tft-match/models/match/tft-match.interface'
import { findSummoner, isWin } from '.'

export function winrate (puuid: string, matches: Partial<ITFTMatchModel>[]) {
  const wins = matches.filter((m) => {
    const summoner = findSummoner(puuid, m.participants || [])
    return summoner && isWin(summoner.placement)
  }).length
  const percentage = wins / matches.length * 100
  return percentage || 0
}
