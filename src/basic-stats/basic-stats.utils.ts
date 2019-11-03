import { TftMatchEnum } from "../enums/tft-match.enum"
import { TftMatchParticipantsModel } from "../tft-match/models/participants/tft-match.participants.interface"
import { ITFTMatchModel } from "../tft-match/models/match/tft-match.interface"

// Private
function isWin (placement?: number) {
  if (!placement) {
    return false
  }
  return placement <= TftMatchEnum.PLACEMENT_WIN
}

// Public
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
  return percentage
}
