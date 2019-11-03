import { ApiResponseModelProperty } from '@nestjs/swagger'

export class TftMatchParticipantsTraitsDTO {
  @ApiResponseModelProperty()
  tier_total!: number

  @ApiResponseModelProperty()
  name!: string

  @ApiResponseModelProperty()
  tier_current!: number

  @ApiResponseModelProperty()
  num_units!: number
}
