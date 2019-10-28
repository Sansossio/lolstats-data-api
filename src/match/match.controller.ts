import { Controller, Query, Post, Get } from '@nestjs/common'
import { MatchService } from './match.service'
import { ApiUseTags, ApiOperation, ApiOkResponse } from '@nestjs/swagger'
import { MatchEntity } from '../database/entities/entities/match.entity'
import { SummonerGetDTO } from '../summoner/dto/summoner.dto'

@Controller('match')
@ApiUseTags('Match')
export class MatchController {
  constructor (
    private readonly service: MatchService
  ) {}

  @Get('summoner')
  @ApiOkResponse({
    type: [MatchEntity]
  })
  @ApiOperation({
    title: 'Get summoner matches'
  })
  async getBySummoner (@Query() params: SummonerGetDTO): Promise<unknown> {
    return this.service.getBySummonerName(params)
  }
}
