import { IsString, IsNotEmpty, IsEnum } from 'class-validator'
import { ApiModelProperty } from '@nestjs/swagger'
import { riotRegions } from 'lolstats-common/src/enum/riot/regions.riot.enum'
import { Regions } from 'api-riot-games/dist/constants'

export class SummonerGetDTO {
  @ApiModelProperty()
  @IsString()
  @IsNotEmpty()
  summonerName: string

  @ApiModelProperty({
    enum: riotRegions
  })
  @IsString()
  @IsNotEmpty()
  @IsEnum(riotRegions)
  region: Regions
}
