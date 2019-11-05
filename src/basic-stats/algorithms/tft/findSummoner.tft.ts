import { TftMatchParticipantsModel } from '../../../tft-match/models/participants/tft-match.participants.interface'

export function findSummoner (puuid: string, participants: Partial<TftMatchParticipantsModel>[]) {
  const participant = participants.find(p => !!p.summoner && p.summoner.puuid === puuid)
  if (!participant) {
    throw new Error('Summoner not found')
  }
  return participant
}
