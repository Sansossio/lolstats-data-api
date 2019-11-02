import { Controller, Get, Query } from '@nestjs/common'
import { StaticDataService } from './static-data.service'
import { ApiUseTags, ApiOkResponse, ApiOperation } from '@nestjs/swagger'
import { QueueDTO } from './models/queue/queue.dto'
import { SeasonDTO } from './models/seasons/seasons.dto'
import { QueryStaticData } from './dto/query.static-data.dto'

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
    return this.service.getQueues(id)
  }

  @Get('seasons')
  @ApiOkResponse({ type: [SeasonDTO] })
  @ApiOperation({
    title: 'Get seasons listing'
  })
  async getSeasons (@Query() { id }: QueryStaticData) {
    return this.service.getSeasons(id)
  }
}
