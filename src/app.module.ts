import { Module } from '@nestjs/common'
import { RiotApiService } from './riot-api/riot-api.service'
import { ConfigService } from './config/config.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule } from './config/config.module'

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useExisting: ConfigService
    })
  ],
  providers: [ConfigService, RiotApiService]
})
export class AppModule {}
