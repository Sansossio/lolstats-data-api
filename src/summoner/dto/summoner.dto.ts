import { IsString, IsNotEmpty, IsEnum } from 'class-validator'
import { ApiModelProperty } from '@nestjs/swagger'
import { Regions } from 'api-riot-games/dist/constants'
import { riotRegionsList } from '../../enum/regions.enum'

export class SummonerGetDTO {
  @ApiModelProperty()
  @IsString()
  @IsNotEmpty()
  summonerName!: string

  @ApiModelProperty({
    enum: riotRegionsList
  })
  @IsString()
  @IsNotEmpty()
  @IsEnum(riotRegionsList)
  region!: Regions
}
