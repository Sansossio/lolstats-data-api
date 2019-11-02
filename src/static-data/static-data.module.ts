import { Module } from '@nestjs/common'
import { StaticDataService } from './static-data.service'
import { RiotApiModule } from '../riot-api/riot-api.module'
import { StaticDataController } from './static-data.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { QueueModel } from './models/queue/queue.model'
import { SeasonsModel } from './models/seasons/seasons.model'
import { MapsModel } from './models/maps/maps.model'
import { StaticTftModel } from './models/static-tft-items/static-tft-items.model'

@Module({
  imports: [
    MongooseModule.forFeature([
      QueueModel,
      SeasonsModel,
      MapsModel,
      StaticTftModel
    ]),
    RiotApiModule
  ],
  providers: [StaticDataService],
  exports: [StaticDataService],
  controllers: [StaticDataController]
})
export class StaticDataModule {}
