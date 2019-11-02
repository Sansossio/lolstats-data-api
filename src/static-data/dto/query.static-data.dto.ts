import { ApiModelPropertyOptional } from '@nestjs/swagger'
import { IsNumberString, IsOptional } from 'class-validator'

export class QueryStaticData {
  @ApiModelPropertyOptional()
  @IsNumberString()
  @IsOptional()
  id!: string
}
