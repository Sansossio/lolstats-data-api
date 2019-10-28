import { Controller, Get, Query, Post } from '@nestjs/common'
import { SummonerService } from './summoner.service'
import { ApiOperation, ApiOkResponse, ApiUseTags } from '@nestjs/swagger'
import { SummonerEntity } from '../database/entities/entities/summoner.entity'
import { SummonerGetDTO } from './dto/summoner.dto'

@Controller('summoner')
@ApiUseTags('Summoner')
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

  @Post('update')
  @ApiOperation({
    title: 'Update summoner'
  })
  @ApiOkResponse({ type: SummonerEntity })
  update (@Query() params: SummonerGetDTO) {
    return this.service.create(params)
  }
}
