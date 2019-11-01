import { ApiModelProperty, ApiResponseModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger'
import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator'
import { RegionsList } from '../../riot-api/riot-api.enum'
import { Regions } from 'twisted/dist/constants'
import { GetSummonerLeaguesDTO } from '../../summoner-leagues/models/summoner-leagues.dto'
import { BaseDTO } from '../../base/base.dto'

// Queries
export class GetSummonerQueryDTO {
  @ApiModelProperty()
  @IsString()
  @IsNotEmpty()
  summonerName!: string

  @ApiModelPropertyOptional()
  @IsString()
  @IsOptional()
  summonerPUUID?: string

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
  gameId!: boolean
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
  _id!: string

  @ApiResponseModelProperty()
  name!: string

  @ApiResponseModelProperty()
  profileIconId!: number

  @ApiResponseModelProperty()
  summonerLevel!: number

  @ApiResponseModelProperty()
  revisionDate!: number

  @ApiResponseModelProperty()
  id!: string

  @ApiResponseModelProperty()
  puuid!: string

  @ApiResponseModelProperty()
  accountId!: string

  @ApiResponseModelProperty()
  loading!: boolean

  @ApiResponseModelProperty()
  bot!: boolean

  @ApiResponseModelProperty()
  region!: Regions

  @ApiResponseModelProperty({
    type: GetSummonerDTOMatches
  })
  matches!: Map<string, boolean>

  @ApiResponseModelProperty({
    type: GetSummonerDTOLeagues
  })
  leagues!: Map<string, GetSummonerDTOLeagues>
}
