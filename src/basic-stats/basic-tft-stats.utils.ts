import * as _ from 'lodash'
import * as algorithms from './algorithms/tft'
import { ITFTMatchModel } from '../tft-match/models/match/tft-match.interface'

enum TFTMatchKeys {
  GOLD = 'gold_left',
  LEVEL = 'level',
  LAST_ROUND = 'last_round'
}

export function ObjectResponse (puuid: string, matches: Partial<ITFTMatchModel>[]) {
  return {
    games: matches.length,
    averages: {
      goldLeft: algorithms.keyAverage(puuid, matches, TFTMatchKeys.GOLD),
      level: algorithms.keyAverage(puuid, matches, TFTMatchKeys.LEVEL),
      lastRound: algorithms.keyAverage(puuid, matches, TFTMatchKeys.LAST_ROUND)
    },
    global: {
      playersEliminated: algorithms.playersEliminated(puuid, matches),
      winrate: algorithms.winrate(puuid, matches)
    },
    placements: algorithms.percentagePerPlacement(puuid, matches),
    mostUsed: {
      units: algorithms.mostUsedUnits(puuid, matches),
      traits: algorithms.mostUsedTraits(puuid, matches)
    }
  }
}

export function FilterByTrait (trait: string, puuid: string, matches: Partial<ITFTMatchModel>[]) {
  return matches.filter(match => {
    const { traits } = algorithms.findSummoner(puuid, match.participants || [])
    if (!traits) {
      return false
    }
    const index = traits.findIndex(t => t.name === trait && !!t.tier_current)
    return index !== -1
  })
}

export function FilterByItem (item: number, puuid: string, matches: Partial<ITFTMatchModel>[]) {
  return matches.filter(match => {
    const { units } = algorithms.findSummoner(puuid, match.participants || [])
    if (!units) {
      return false
    }
    let index = -1
    for (const unit of units) {
      index = (unit.items || []).findIndex(i => i && i.id === item)
      if (index !== -1) {
        break
      }
    }
    return index !== -1
  })
}
