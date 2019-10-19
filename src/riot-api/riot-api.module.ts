import { Module, Global } from '@nestjs/common'
import { RiotApiService } from './riot-api.service'

@Global()
@Module({
  providers: [RiotApiService],
  exports: [RiotApiService]
})
export class RiotApiModule {}
