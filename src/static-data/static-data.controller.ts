import { Controller, Get, Query } from '@nestjs/common'
import { StaticDataService } from './static-data.service'
import { ApiUseTags, ApiOkResponse, ApiOperation } from '@nestjs/swagger'
import { QueueDTO } from './models/queue/queue.dto'
import { SeasonDTO } from './models/seasons/seasons.dto'
import { QueryStaticData } from './dto/query.static-data.dto'
import { MapsDTO } from './models/maps/maps.dto'
import { StaticTftItemsDTO } from './models/static-tft-items/static-tft-items.dto'

@Controller('static-data')
@ApiUseTags('Static data')
export class StaticDataController {
  constructor (
    private readonly service: StaticDataService
  ) {}

  @Get('queues')
  @ApiOkResponse({ type: [QueueDTO] })
  @ApiOperation({
    title: 'Get queues listing'
  })
  async getQueues (@Query() { id }: QueryStaticData) {
    return this.service.getQueue(id)
  }

  @Get('seasons')
  @ApiOkResponse({ type: [SeasonDTO] })
  @ApiOperation({
    title: 'Get seasons listing'
  })
  async getSeasons (@Query() { id }: QueryStaticData) {
    return this.service.getSeasons(id)
  }

  @Get('maps')
  @ApiOkResponse({ type: [MapsDTO] })
  @ApiOperation({
    title: 'Get maps listing'
  })
  async getMaps (@Query() { id }: QueryStaticData) {
    return this.service.getMaps(id)
  }

  @Get('tft/items')
  @ApiOkResponse({ type: [StaticTftItemsDTO] })
  @ApiOperation({
    title: 'Get tft items listing'
  })
  async getTftItems (@Query() { id }: QueryStaticData) {
    return this.service.getTftitems(id)
  }
}
