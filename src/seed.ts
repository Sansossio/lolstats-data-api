import { SeederModule } from './seeder/seeder.module'
import { NestFactory } from '@nestjs/core'
import { SeederService } from './seeder/seeder.service'

async function bootstrap () {
  const appContext = await NestFactory.createApplicationContext(SeederModule)
  const seeder = appContext.get(SeederService)
  await seeder.seed()
  await appContext.close()
}

bootstrap()
