import { Module } from '@nestjs/common'
import { InformationService } from './information.service'
import { InformationController } from './information.controller'
import { RiotApiModule } from '../riot-api/riot-api.module'

@Module({
  imports: [RiotApiModule],
  providers: [InformationService],
  controllers: [InformationController]
})
export class InformationModule {}
