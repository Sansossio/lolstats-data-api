import { IBaseInterface } from '../../../base/base.interface'
import { TftMatchParticipantsModel } from '../participants/tft-match.participants.interface'
import { Regions } from 'twisted/dist/constants'
import { IQueueModel } from '../../../static-data/models/queue/queue.interface'

export interface ITFTMatchModel extends IBaseInterface {
  match_id: string
  region: Regions
  data_version: string
  tft_set_number: number
  game_length: number
  queue: Partial<IQueueModel>
  game_version: string
  game_datetime: Date
  participants: Partial<TftMatchParticipantsModel>[]
  participantsIds: string[]
}
