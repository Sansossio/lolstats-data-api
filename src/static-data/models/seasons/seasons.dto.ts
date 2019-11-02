import { ApiResponseModelProperty } from '@nestjs/swagger'

export class SeasonDTO {
  @ApiResponseModelProperty()
  id!: number

  @ApiResponseModelProperty()
  season!: string
}
