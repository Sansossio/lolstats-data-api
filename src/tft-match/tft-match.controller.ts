import { Controller, Post, Query, Get } from '@nestjs/common'
import { TftMatchService } from './tft-match.service'
import { ApiUseTags, ApiOkResponse, ApiOperation } from '@nestjs/swagger'
import { QueryTftMatches } from './dto/query.tft-match.dto'
import { TftMatchModelDTO } from './models/match/tft-match.dto'

@Controller('tft-match')
@ApiUseTags('Teamfight tactics')
export class TftMatchController {
  constructor (
    private readonly service: TftMatchService
  ) {}

  @Post('summoner')
  @ApiOkResponse({ type: [TftMatchModelDTO] })
  @ApiOperation({
    title: 'Update summoner matches'
  })
  async update (@Query() params: QueryTftMatches) {
    return this.service.updateSummoner(params)
  }

  @Get('summoner')
  @ApiOkResponse({ type: [TftMatchModelDTO] })
  @ApiOperation({
    title: 'Get summoner matcehs'
  })
  async getBySummoner (@Query() params: QueryTftMatches) {
    return this.service.getBySummoner(params)
  }
}
