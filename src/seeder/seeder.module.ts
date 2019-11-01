import { Module } from '@nestjs/common'
import { SeederService } from './seeder.service'
import { DatabaseConnection } from '../database/database.connection'

@Module({
  imports: [
    DatabaseConnection
  ],
  providers: [SeederService],
  exports: [SeederService]
})
export class SeederModule {}
