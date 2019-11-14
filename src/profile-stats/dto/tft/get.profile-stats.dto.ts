import { GetSummonerQueryDTO } from '../../../summoner/models/summoner.dto'
import { ApiModelPropertyOptional } from '@nestjs/swagger'
import { IsEnum, IsOptional, IsNumberString } from 'class-validator'
import { TftMatchStatsEnum } from '../../../enums/tft-match.enum'

const name = Object.values(TftMatchStatsEnum)

export class GetProfileTftStats extends GetSummonerQueryDTO {
  @ApiModelPropertyOptional({ enum: name })
  @IsEnum(name)
  @IsOptional()
  statName?: TftMatchStatsEnum

  @ApiModelPropertyOptional()
  @IsNumberString()
  @IsOptional()
  queue?: number
}
