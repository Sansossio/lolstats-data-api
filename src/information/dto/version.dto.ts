import { ApiResponseModelProperty } from '@nestjs/swagger'

export class VersionDTO {
  @ApiResponseModelProperty()
  version!: string
}
