import { Module } from '@nestjs/common'
import { StaticDataService } from './static-data.service'
import { RiotApiModule } from '../riot-api/riot-api.module'
import { StaticDataController } from './static-data.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { QueueModel } from './models/queue/queue.model'

@Module({
  imports: [
    MongooseModule.forFeature([
      QueueModel
    ]),
    RiotApiModule
  ],
  providers: [StaticDataService],
  exports: [StaticDataService],
  controllers: [StaticDataController]
})
export class StaticDataModule {}
