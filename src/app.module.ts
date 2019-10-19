import { Module } from '@nestjs/common'
import { RiotApiService } from './riot-api/riot-api.service'
import { ConfigService } from './config/config.service'

@Module({
  providers: [ConfigService, RiotApiService]
})
export class AppModule {}
