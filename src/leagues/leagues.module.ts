import { Module } from '@nestjs/common'
import { LeaguesService } from './leagues.service'
import { ConfigModule } from '../config/config.module'

@Module({
  providers: [LeaguesService],
  exports: [LeaguesService]
})
export class LeaguesModule {}
