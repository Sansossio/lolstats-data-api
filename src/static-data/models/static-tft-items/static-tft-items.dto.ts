import { ApiResponseModelProperty } from '@nestjs/swagger'

export class StaticTftItemsDTO {
  @ApiResponseModelProperty()
  id!: number

  @ApiResponseModelProperty()
  name!: string
}
