import { Controller, Get, Query, Post } from '@nestjs/common'
import { ProfileTftStatsService } from './profile-tft-stats.service'
import { GetSummonerQueryDTO } from '../summoner/models/summoner.dto'
import { ApiOperation, ApiUseTags } from '@nestjs/swagger'
import { GetProfileTftStats } from './dto/tft/get.profile-stats.dto'

@Controller('profile-stats/tft')
@ApiUseTags('Profile stats - TFT')
export class BasicTftStatsController {
  constructor (
    private readonly service: ProfileTftStatsService
  ) {}

  @Get()
  @ApiOperation({
    title: 'Get summoner stats'
  })
  async get (@Query() params: GetProfileTftStats) {
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
