import { Controller, Get, Query } from '@nestjs/common'
import { SummonerService } from './summoner.service'
import { ApiOperation, ApiOkResponse } from '@nestjs/swagger'
import { SummonerEntity } from './summoner.entity'
import { SummonerGetDTO } from './dto/summoner.dto'

@Controller('summoner')
export class SummonerController {
  constructor (
    private readonly service: SummonerService
  ) {}

  @Get()
  @ApiOperation({
    title: 'Get summoner'
  })
  @ApiOkResponse({ type: SummonerEntity })
  get (@Query() params: SummonerGetDTO) {
    return this.service.get(params)
  }
}
