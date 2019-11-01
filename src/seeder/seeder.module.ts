import { Module } from '@nestjs/common'
import { SeederService } from './seeder.service'
import { StaticDataModule } from '../static-data/static-data.module'
import { RiotApiModule } from '../riot-api/riot-api.module'
import { DatabaseConnection } from '../database/database.connection'

@Module({
  imports: [
    DatabaseConnection,
    RiotApiModule,
    StaticDataModule
  ],
  providers: [SeederService],
  exports: [SeederService]
})
export class SeederModule {}
