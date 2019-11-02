import { GetSummonerQueryDTO } from '../../summoner/models/summoner.dto'
import { ApiModelProperty } from '@nestjs/swagger'
import { IsNumberString, IsInt, Max, Min, IsNotEmpty } from 'class-validator'
import { Type } from 'class-transformer'

export class QueryTftMatches extends GetSummonerQueryDTO {
  @ApiModelProperty()
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  @Max(10)
  @Min(1)
  limit!: number

  @ApiModelProperty()
  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  page!: number
}
