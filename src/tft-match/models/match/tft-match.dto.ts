import { Regions } from 'twisted/dist/constants'
import { ApiResponseModelProperty } from '@nestjs/swagger'
import { QueueDTO } from '../../../static-data/models/queue/queue.dto'
import { TftMatchParticipantsModelDto } from '../participants/tft-match.participants.dto'

export class TftMatchModelDTO {
  @ApiResponseModelProperty()
  match_id!: string

  @ApiResponseModelProperty({
    type: String
  })
  region!: Regions

  @ApiResponseModelProperty()
  data_version!: string

  @ApiResponseModelProperty()
  tft_set_number!: number

  @ApiResponseModelProperty()
  game_length!: number

  @ApiResponseModelProperty()
  queue!: QueueDTO

  @ApiResponseModelProperty()
  game_version!: string

  @ApiResponseModelProperty()
  game_datetime!: Date

  @ApiResponseModelProperty({
    type: [TftMatchParticipantsModelDto]
  })
  participants!: TftMatchParticipantsModelDto[]

  @ApiResponseModelProperty()
  participantsIds!: string[]

}
