import { Module, Global } from '@nestjs/common'
import { databaseProviders } from '../config/configs/database/connections.config'

@Global()
@Module({
  providers: [...databaseProviders],
  exports: [...databaseProviders]
})
export class DatabaseModule {}
