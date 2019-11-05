import { findSummoner } from '.'
import { ITFTMatchModel } from '../../../tft-match/models/match/tft-match.interface'

export function playersElimited (puuid: string, matches: Partial<ITFTMatchModel>[]) {
  let playersElimited = 0
  for (const match of matches) {
    const { players_eliminated } = findSummoner(puuid, match.participants || [])
    playersElimited += players_eliminated || 0
  }
  if (playersElimited < 0) {
    throw new Error('Bad elimited players')
  }
  return playersElimited
}
