import { ApiModelProperty } from '@nestjs/swagger'
import { IsString, IsNotEmpty, IsEnum } from 'class-validator'
import { RegionsList } from '../riot-api/riot-api.enum'
import { Regions } from 'api-riot-games/dist/constants'

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
