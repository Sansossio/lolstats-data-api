import { Controller, Post, Get, Query, Body } from '@nestjs/common'
import { SummonerService } from './summoner.service'
import { GetSummonerQueryDTO, GetSummonerDTO } from './models/summoner.dto'
import { ApiOperation, ApiUseTags, ApiOkResponse } from '@nestjs/swagger'
import { GetSummonerLeaguesDTO } from '../summoner-leagues/models/summoner-leagues.dto'

@Controller('summoner')
@ApiUseTags('Summoners')
export class SummonerController {
  constructor (
    private readonly service: SummonerService
  ) {}

  @Get()
  @ApiOkResponse({ type: GetSummonerDTO })
  @ApiOperation({
    title: 'Find / create username'
  })
  get (@Query() params: GetSummonerQueryDTO) {
    return this.service.get(params)
  }

  @Post()
  @ApiOkResponse({ type: GetSummonerDTO })
  @ApiOperation({
    title: 'Update / create new user'
  })
  update (@Body() body: GetSummonerQueryDTO) {
    return this.service.update(body)
  }

  @Get('leagues/historic')
  @ApiOkResponse({ type: [GetSummonerLeaguesDTO] })
  @ApiOperation({
    title: 'Leagues historic',
    description: 'Return leagues historic from an user'
  })
  leagues (@Query() params: GetSummonerQueryDTO) {
    return this.service.leaguesHistoric(params)
  }
}
