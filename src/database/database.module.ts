import { Module, Global } from '@nestjs/common'
import { databaseProviders } from './database.connections'
import { DatabaseService } from './database.service'

@Global()
@Module({
  providers: [...databaseProviders, DatabaseService],
  exports: [...databaseProviders, DatabaseService]
})
export class DatabaseModule {}
