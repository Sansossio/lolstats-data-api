import { ApiResponseModelProperty } from '@nestjs/swagger'

export class QueueDTO {
  @ApiResponseModelProperty()
  queueId!: number

  @ApiResponseModelProperty()
  map!: string

  @ApiResponseModelProperty()
  description?: string

  @ApiResponseModelProperty()
  notes?: string
}
