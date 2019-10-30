import { ApiResponseModelProperty } from '@nestjs/swagger'
import { BaseDTO } from '../../base/base.dto'

export class GetSummonerLeaguesDTO extends BaseDTO {
  @ApiResponseModelProperty()
  _id!: string

  @ApiResponseModelProperty()
  queueType!: string

  @ApiResponseModelProperty()
  summonerName!: string

  @ApiResponseModelProperty()
  hotStreak!: boolean

  @ApiResponseModelProperty()
  wins!: number

  @ApiResponseModelProperty()
  veteran!: boolean

  @ApiResponseModelProperty()
  losses!: number

  @ApiResponseModelProperty()
  rank!: number

  @ApiResponseModelProperty()
  leagueId!: string

  @ApiResponseModelProperty()
  inactive!: boolean

  @ApiResponseModelProperty()
  freshBlood!: boolean

  @ApiResponseModelProperty()
  tier!: string

  @ApiResponseModelProperty()
  summonerId!: string

  @ApiResponseModelProperty()
  leaguePoints!: number

  @ApiResponseModelProperty()
  summoner!: string
}
