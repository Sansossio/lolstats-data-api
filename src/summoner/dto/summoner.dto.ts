import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator'
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger'
import { Regions } from 'api-riot-games/dist/constants'
import { riotRegionsList } from '../../enum/regions.enum'

export class SummonerGetDTO {
  @ApiModelProperty()
  @IsString()
  @IsNotEmpty()
  summonerName!: string

  @ApiModelPropertyOptional()
  @IsString()
  @IsOptional()
  accountId?: string

  @ApiModelProperty({
    enum: riotRegionsList
  })
  @IsString()
  @IsNotEmpty()
  @IsEnum(riotRegionsList)
  region!: Regions
}
