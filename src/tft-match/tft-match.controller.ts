import { Controller, Post, Query, Get } from '@nestjs/common'
import { TftMatchService } from './tft-match.service'
import { GetSummonerQueryDTO } from '../summoner/models/summoner.dto'
import { ApiUseTags } from '@nestjs/swagger'

@Controller('tft-match')
@ApiUseTags('Teamfight tactics')
export class TftMatchController {
  constructor (
    private readonly service: TftMatchService
  ) {}

  @Post('update')
  async update (@Query() params: GetSummonerQueryDTO) {
    return this.service.updateSummoner(params)
  }

  @Get('summoner')
  async getBySummoner (@Query() params: GetSummonerQueryDTO) {
    return this.service.getBySummoner(params)
  }
}
