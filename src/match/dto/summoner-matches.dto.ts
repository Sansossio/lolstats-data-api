import { ApiModelProperty, ApiResponseModelProperty } from '@nestjs/swagger'
import { IsPositive, IsNotEmpty, IsNumberString } from 'class-validator'
import { SummonerMatchesEntity } from '../entities/summoner-matches.entity'

export class SummonerMatchesFindBySummoner {
  @ApiModelProperty()
  @IsNumberString()
  idSummoner!: number
}

export class SummonerMatchesFindBySummonerResponse {
  @ApiResponseModelProperty()
  total!: number

  @ApiResponseModelProperty({ type: [SummonerMatchesEntity] })
  matches!: SummonerMatchesEntity[]
}
