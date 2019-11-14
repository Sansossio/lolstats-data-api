import { Controller, Get } from '@nestjs/common'
import { InformationService } from './information.service'
import { ApiOkResponse, ApiOperation, ApiUseTags } from '@nestjs/swagger'
import { VersionDTO } from './dto/version.dto'

const riotInformation = 'Information - Riot'

@Controller('information')
export class InformationController {
  constructor (
    private readonly service: InformationService
  ) {}

  @Get('riot/current-version')
  @ApiOperation({
    title: 'Get current riot version'
  })
  @ApiOkResponse({ type: VersionDTO })
  @ApiUseTags(riotInformation)
  getCurrentVersion () {
    return this.service.getCurrentVersion()
  }
}
