import { GetSummonerQueryDTO } from '../../summoner/models/summoner.dto'
import { ApiModelProperty } from '@nestjs/swagger'
import { IsInt, Max, Min, IsNotEmpty } from 'class-validator'
import { Type } from 'class-transformer'
import { LimitsEnum } from '../../config/config.enum'

export class QueryTftMatches extends GetSummonerQueryDTO {
  @ApiModelProperty()
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  @Max(LimitsEnum.MATCH_LIMIT_MAX)
  @Min(LimitsEnum.MATCH_LIMIT_MIN)
  limit!: number

  @ApiModelProperty()
  @Type(() => Number)
  @IsInt()
  @Min(LimitsEnum.MATCH_PAGE_MIN)
  @IsNotEmpty()
  page!: number
}
