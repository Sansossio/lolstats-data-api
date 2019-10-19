import { IsString, IsNotEmpty, IsEnum } from 'class-validator'
import { ApiModelProperty } from '@nestjs/swagger'
import { riotRegions } from 'src/riot-api/dto/riot-api.dto'
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
