import { ApiResponseModelProperty } from '@nestjs/swagger'
import { BaseDTO } from '../../../base/base.dto'

export class MapsDTO extends BaseDTO {
  @ApiResponseModelProperty()
  mapId!: string

  @ApiResponseModelProperty()
  mapName!: string

  @ApiResponseModelProperty()
  notes?: string | null
}
