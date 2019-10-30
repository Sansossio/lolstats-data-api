import { ApiModelProperty, ApiResponseModelProperty } from '@nestjs/swagger'
import { IsString, IsNotEmpty, IsEnum } from 'class-validator'
import { RegionsList } from '../../riot-api/riot-api.enum'
import { Regions } from 'api-riot-games/dist/constants'
import { GetSummonerLeaguesDTO } from '../../summoner-leagues/models/summoner-leagues.dto'
import { BaseDTO } from '../../base/base.dto'

// Queries
export class GetSummonerQueryDTO {
  @ApiModelProperty()
  @IsString()
  @IsNotEmpty()
  summonerName!: string

  @ApiModelProperty({
    enum: RegionsList
  })
  @IsEnum(RegionsList)
  @IsNotEmpty()
  region!: Regions
}

// Partial
class GetSummonerDTOMatches {
  @ApiResponseModelProperty()
  gameId!: Boolean
}

class GetSummonerDTOLeagues {
  @ApiResponseModelProperty({
    type: GetSummonerLeaguesDTO
  })
  queueType!: GetSummonerLeaguesDTO
}

// DTO
export class GetSummonerDTO extends BaseDTO {
  @ApiResponseModelProperty()
  _id!: String

  @ApiResponseModelProperty()
  name!: String

  @ApiResponseModelProperty()
  profileIconId!: Number

  @ApiResponseModelProperty()
  summonerLevel!: Number

  @ApiResponseModelProperty()
  revisionDate!: Number

  @ApiResponseModelProperty()
  id!: String

  @ApiResponseModelProperty()
  puuid!: String

  @ApiResponseModelProperty()
  accountId!: String

  @ApiResponseModelProperty()
  loading!: Boolean

  @ApiResponseModelProperty()
  bot!: Boolean

  @ApiResponseModelProperty()
  region!: Regions

  @ApiResponseModelProperty({
    type: GetSummonerDTOMatches
  })
  matchs!: Map<string, boolean>

  @ApiResponseModelProperty({
    type: GetSummonerDTOLeagues
  })
  leagues!: Map<string, GetSummonerDTOLeagues>
}
