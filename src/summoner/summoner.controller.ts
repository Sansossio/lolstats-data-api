import { Controller, Post, Get } from '@nestjs/common'
import { SummonerService } from './summoner.service'

@Controller('summoner')
export class SummonerController {
  constructor (
    private readonly service: SummonerService
  ) {}

  @Get()
  get () {
    return this.service.get()
  }

  @Post()
  create () {
    return this.service.create()
  }
}
