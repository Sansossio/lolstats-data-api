import { IBaseInterface } from '../../../base/base.interface'
import { TftMatchParticipantsModel } from '../participants/tft-match.participants.interface'
import { Regions } from 'api-riot-games/dist/constants'

export interface ITFTMatchModel extends IBaseInterface {
  match_id: number
  region: Regions
  data_version: string
  tft_set_number: number
  game_length: number
  queue: number
  game_version: string
  game_datetime: Date
  participants: Partial<TftMatchParticipantsModel>[]
}
