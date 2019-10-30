import { Controller, Post, Get, Query } from '@nestjs/common'
import { SummonerService } from './summoner.service'
import { GetSummonerQueryDTO } from './summoner.dto'

@Controller('summoner')
export class SummonerController {
  constructor (
    private readonly service: SummonerService
  ) {}

  @Get()
  get (@Query() params: GetSummonerQueryDTO) {
    return this.service.get(params)
  }

  @Post()
  create () {
    return this.service.create()
  }
}
