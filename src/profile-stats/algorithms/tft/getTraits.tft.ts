import { ITFTMatchModel } from '../../../tft-match/models/match/tft-match.interface'
import { findSummoner } from '../tft'

export function getTraits (puuid: string, matches: Partial<ITFTMatchModel>[]) {
  return matches.reduce<string[]>((prev, curr) => {
    const { traits } = findSummoner(puuid, curr.participants || [])
    if (!traits) {
      return prev
    }
    for (const trait of traits) {
      const findIndex = prev.findIndex(name => trait.name === name)
      if (findIndex === -1 && trait.name) {
        prev.push(trait.name)
      }
    }
    return prev
  }, [])
}
