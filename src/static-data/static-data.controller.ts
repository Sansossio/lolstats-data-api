import { Controller, Get } from '@nestjs/common'
import { StaticDataService } from './static-data.service'
import { ApiUseTags, ApiOkResponse, ApiOperation } from '@nestjs/swagger'
import { QueueDTO } from './models/queue/queue.dto'
import { SeasonDTO } from './models/seasons/seasons.dto'

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
  async getQueues () {
    return this.service.getQueues()
  }

  @Get('seasons')
  @ApiOkResponse({ type: [SeasonDTO] })
  @ApiOperation({
    title: 'Get seasons listing'
  })
  async getSeasons () {
    return this.service.getSeasons()
  }
}
