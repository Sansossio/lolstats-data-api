import { ApiResponseModelProperty } from '@nestjs/swagger'
import { StaticTftItemsDTO } from '../../../../static-data/models/static-tft-items/static-tft-items.dto'

export class TftMatchParticipantsUnitsDTO {
  @ApiResponseModelProperty()
  tier!: Number

  @ApiResponseModelProperty({
    type: [StaticTftItemsDTO]
  })
  items!: StaticTftItemsDTO[]

  @ApiResponseModelProperty()
  character_id!: String

  @ApiResponseModelProperty()
  name!: String

  @ApiResponseModelProperty()
  rarity!: Number
}
