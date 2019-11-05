import * as _ from 'lodash'
import * as algorithms from './algorithms/tft'
import { ITFTMatchModel } from '../tft-match/models/match/tft-match.interface'

enum TFTMatchKeys {
  GOLD = 'gold_left',
  LEVEL = 'level',
  LAST_ROUND = 'last_round'
}

export function objectResponse (puuid: string, matches: ITFTMatchModel[]) {
  return {
    games: matches.length,
    averages: {
      goldLeft: algorithms.keyAverage(puuid, matches, TFTMatchKeys.GOLD),
      level: algorithms.keyAverage(puuid, matches, TFTMatchKeys.LEVEL),
      lastRound: algorithms.keyAverage(puuid, matches, TFTMatchKeys.LAST_ROUND)
    },
    global: {
      playersEliminated: algorithms.playersElimited(puuid, matches),
      winrate: algorithms.winrate(puuid, matches)
    },
    mostUsed: {
      units: algorithms.mostUsedUnits(puuid, matches),
      traits: algorithms.mostUsedTraits(puuid, matches)
    }
  }
}
