import { MatchTFTDTO } from 'twisted/dist/dto/Match/Tft/MatchTFT.dto'
import { ITFTMatchModel } from './models/match/tft-match.interface'
import { ISummonerModel } from '../summoner/models/summoner.interface'
import { TftMatchParticipantsModel } from './models/participants/tft-match.participants.interface'
import { Regions } from 'twisted/dist/constants'
import { InternalServerErrorException } from '@nestjs/common'
import { IQueueModel } from '../static-data/models/queue/queue.interface'

function timestampToDate (value: number): Date {
  return new Date(value)
}

function getSummonerID (puuid: string, users: ISummonerModel[]): Partial<ISummonerModel> {
  const summoner = users.find(u => u.puuid === puuid)
  if (!summoner) {
    throw new InternalServerErrorException('Bad summoners match (tft)')
  }
  return summoner
}

function parseParticipants (match: MatchTFTDTO, users: ISummonerModel[]): Partial<TftMatchParticipantsModel>[] {
  const response: Partial<TftMatchParticipantsModel>[] = []
  const {
    info: {
      participants
    }
  } = match
  // Match participants
  for (const participant of participants) {
    // Values
    const {
      placement,
      level,
      last_round,
      time_eliminated,
      players_eliminated,
      puuid,
      total_damage_to_players,
      gold_left,
      traits,
      units,
      companion
    } = participant
    const summoner = getSummonerID(puuid, users)
    // Set
    const parsedSummoner: Partial<TftMatchParticipantsModel> = {
      placement,
      level,
      last_round,
      time_eliminated,
      players_eliminated,
      puuid,
      total_damage_to_players,
      gold_left,
      traits,
      units,
      companion,
      summoner
    }

    response.push(parsedSummoner)
  }
  return response
}

function parseParticipantsIds (users: ISummonerModel[]) {
  return users.map(u => u._id)
}

export function riotToModel (
  match: MatchTFTDTO,
  region: Regions,
  users: ISummonerModel[],
  queue: IQueueModel
  ): Partial<ITFTMatchModel> {
  const { info, metadata } = match
  // Participants match
  const participants = parseParticipants(match, users)
  const participantsIds = parseParticipantsIds(users)
  // Match
  return {
    match_id: metadata.match_id,
    data_version: metadata.data_version,
    tft_set_number: info.tft_set_number,
    game_length: info.game_length,
    game_version: info.game_version,
    game_datetime: timestampToDate(info.game_datetime),
    queue,
    participants,
    participantsIds,
    region
  }
}
