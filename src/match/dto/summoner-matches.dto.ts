import { ApiModelProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumberString, IsString, IsEnum } from 'class-validator'
import { riotRegionsList } from '../../enum/regions.enum'
import { Regions } from 'api-riot-games/dist/constants'

export class MatchesFindBySummoner {
  @ApiModelProperty()
  @IsNumberString()
  @IsNotEmpty()
  idSummoner!: number
}

export class MatchesFindParams {
  beginIndex?: number
  endIndex?: number
  beginTime?: number
}
