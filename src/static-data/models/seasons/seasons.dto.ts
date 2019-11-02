import { ApiResponseModelProperty } from '@nestjs/swagger'
import { BaseDTO } from '../../../base/base.dto'

export class SeasonDTO extends BaseDTO {
  @ApiResponseModelProperty()
  id!: number

  @ApiResponseModelProperty()
  season!: string
}
