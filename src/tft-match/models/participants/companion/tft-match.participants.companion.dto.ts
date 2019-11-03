import { ApiResponseModelProperty } from '@nestjs/swagger'

export class TftMatchParticipantsCompanionDTO {
  @ApiResponseModelProperty()
  content_ID!: string

  @ApiResponseModelProperty()
  skin_ID!: number

  @ApiResponseModelProperty()
  species!: string
}
