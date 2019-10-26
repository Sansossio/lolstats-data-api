import { Controller, Get, Query, Post } from '@nestjs/common'
import { SummonerService } from './summoner.service'
import { ApiOperation, ApiOkResponse, ApiUseTags } from '@nestjs/swagger'
import { SummonerContextEntity } from './summoner.entity'
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
  @ApiOkResponse({ type: SummonerContextEntity })
  get (@Query() params: SummonerGetDTO) {
    return this.service.get(params)
  }

  @Post('update')
  @ApiOperation({
    title: 'Update summoner'
  })
  @ApiOkResponse({ type: SummonerContextEntity })
  update (@Query() params: SummonerGetDTO) {
    return this.service.create(params)
  }
}
