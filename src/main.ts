import { NestFactory } from '@nestjs/core'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'

async function bootstrap () {
  const app = await NestFactory.create(AppModule)
  app.useGlobalPipes(new ValidationPipe())
  const options = new DocumentBuilder()
    .setTitle('LolStats - Context api')
    .setDescription('Riot games api proxy')
    .build()
  const document = SwaggerModule.createDocument(app, options)
  SwaggerModule.setup('explorer', app, document)
  await app.listen(3000)
}

bootstrap()

process.on('uncaughtException', function (exception) {
  console.error(exception)
})
