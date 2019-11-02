import { Controller, Post, Query, Get } from '@nestjs/common'
import { TftMatchService } from './tft-match.service'
import { ApiUseTags } from '@nestjs/swagger'
import { QueryTftMatches } from './dto/query.tft-match.dto'

@Controller('tft-match')
@ApiUseTags('Teamfight tactics')
export class TftMatchController {
  constructor (
    private readonly service: TftMatchService
  ) {}

  @Post('update')
  async update (@Query() params: QueryTftMatches) {
    return this.service.updateSummoner(params)
  }

  @Get('summoner')
  async getBySummoner (@Query() params: QueryTftMatches) {
    return this.service.getBySummoner(params)
  }
}
