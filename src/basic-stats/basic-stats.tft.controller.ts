import { Controller, Get, Query, Post } from '@nestjs/common'
import { BasicTftStatsService } from './basic-tft-stats.service'
import { GetSummonerQueryDTO } from '../summoner/models/summoner.dto'
import { ApiOperation } from '@nestjs/swagger'

@Controller('basic-tft-stats')
export class BasicTftStatsController {
  constructor (
    private readonly service: BasicTftStatsService
  ) {}

  @Get()
  @ApiOperation({
    title: 'Get summoner stats'
  })
  async get (@Query() params: GetSummonerQueryDTO) {
    return this.service.get(params)
  }

  @Post()
  @ApiOperation({
    title: 'Update user stats (remove it)'
  })
  async update (@Query() params: GetSummonerQueryDTO) {
    await this.service.updateSummoner(params)
  }
}
