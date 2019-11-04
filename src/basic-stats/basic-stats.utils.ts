import { TftMatchEnum } from '../enums/tft-match.enum'
import { TftMatchParticipantsModel } from '../tft-match/models/participants/tft-match.participants.interface'
import { ITFTMatchModel } from '../tft-match/models/match/tft-match.interface'
import * as _ from 'lodash'

// Private
function isWin (placement?: number) {
  if (!placement) {
    return false
  }
  return placement <= TftMatchEnum.PLACEMENT_WIN
}

// Public
export function getQueues (matches: ITFTMatchModel[]) {
  return matches.reduce<string[]>((prev, curr) => {
    const name = String(curr.queue.queueId || 0)
    const exists = !!prev.find(cName => cName === name)
    if (exists) {
      return prev
    }
    prev.push(name)
    return prev
  }, [TftMatchEnum.STATS_GLOBAL as string])
}

export function mostTraitsUsed (puuid: string, matches: ITFTMatchModel[]) {
  let response: {
    name: string,
    num_units: number,
    games: number
  }[] = []
  for (const match of matches) {
    // Find traits
    const { traits } = findSummoner(puuid, match.participants)
    if (!traits) {
      throw new Error('Invalid model (participant traits)')
    }
    // Iterate over traits
    for (const trait of traits) {
      const { name = '', num_units = 0 } = trait
      const findIndex = response.findIndex(r => r.name === name)
      // Upsert
      if (findIndex !== -1) {
        response[findIndex].num_units += num_units
      } else {
        response.push({
          name,
          num_units,
          games: 0
        })
      }
    }
    response = response.map((val) => {
      val.games++
      return val
    })
  }

  return _.orderBy(response, v => -v.games)
    .slice(0, TftMatchEnum.MOST_TRAITS_TOTAL)
}

export function mostUnits (puuid: string, matches: ITFTMatchModel[]) {
  const response: {
    name?: string,
    character_id?: string,
    games: number,
    tier?: number
  }[] = []
  for (const match of matches) {
    const { units } = findSummoner(puuid, match.participants)
    if (!units) {
      throw new Error('Invalid model (participant units)')
    }
    for (const unit of units) {
      const findIndex = response.findIndex(r => r.name === unit.name)
      if (findIndex !== -1) {
        response[findIndex].games++
      } else {
        response.push({
          name: unit.name,
          character_id: unit.character_id,
          games: 1,
          tier: unit.tier
        })
      }
    }
  }

  return _.sortBy(response, r => -r.games)
    .slice(0, TftMatchEnum.MOST_UNITS_TOTAL)
}

export function playersElimited (puuid: string, matches: ITFTMatchModel[]) {
  let playersEliminated = 0
  for (const match of matches) {
    const { players_eliminated } = findSummoner(puuid, match.participants)
    playersEliminated += players_eliminated || 0
  }
  return playersEliminated
}

export function goldLeftAverage (puuid: string, matches: ITFTMatchModel[]) {
  let totalGold = 0
  for (const match of matches) {
    const { gold_left } = findSummoner(puuid, match.participants)
    totalGold += gold_left || 0
  }
  return totalGold / matches.length
}

export function levelAverage (puuid: string, matches: ITFTMatchModel[]) {
  let totalLevel = 0
  for (const match of matches) {
    const { level } = findSummoner(puuid, match.participants)
    totalLevel += level || 0
  }
  return totalLevel / matches.length
}

export function lastRoundAverage (puuid: string, matches: ITFTMatchModel[]) {
  let totalLastRound = 0
  for (const match of matches) {
    const { last_round  } = findSummoner(puuid, match.participants)
    totalLastRound += last_round || 0
  }
  return totalLastRound / matches.length
}

export function winrate (puuid: string, matches: ITFTMatchModel[]) {
  return calculateWinRate(puuid, matches)
}

export function findSummoner (puuid: string, participants: Partial<TftMatchParticipantsModel>[]) {
  const participant = participants.find(p => !!p.summoner && p.summoner.puuid === puuid)
  if (!participant) {
    throw new Error('Summoner not found')
  }
  return participant
}

export function calculateWinRate (puuid: string, matches: ITFTMatchModel[]) {
  const wins = matches.filter((m) => {
    const summoner = findSummoner(puuid, m.participants)
    return summoner && isWin(summoner.placement)
  }).length
  const percentage = wins / matches.length * 100
  return percentage || 0
}
