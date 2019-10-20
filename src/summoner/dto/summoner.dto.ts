import { IsString, IsNotEmpty, IsEnum } from 'class-validator'
import { ApiModelProperty } from '@nestjs/swagger'
import Regions, { riotRegionsList } from 'lolstats-common/src/enum/riot/regions.riot.enum'

export class SummonerGetDTO {
  @ApiModelProperty()
  @IsString()
  @IsNotEmpty()
  summonerName: string

  @ApiModelProperty({
    enum: riotRegionsList
  })
  @IsString()
  @IsNotEmpty()
  @IsEnum(riotRegionsList)
  region: Regions
}
