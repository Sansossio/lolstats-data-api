import { Controller, Get, Query } from '@nestjs/common'
import { MatchService } from './match.service'
import { ApiOkResponse, ApiUseTags, ApiOperation } from '@nestjs/swagger'
import { SummonerMatchesFindBySummoner, SummonerMatchesFindBySummonerResponse } from './dto/summoner-matches.dto'

@Controller('match')
@ApiUseTags('Match')
export class MatchController {
  constructor (
    private readonly service: MatchService
  ) {}

  @Get('summoner')
  @ApiOkResponse({ type: SummonerMatchesFindBySummonerResponse })
  @ApiOperation({
    title: 'Get summoner match list'
  })
  async get (@Query() params: SummonerMatchesFindBySummoner): Promise<SummonerMatchesFindBySummonerResponse> {
    return this.service.getByUser(params)
  }
}
