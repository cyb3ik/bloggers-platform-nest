import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.setGlobalPrefix('bloggers-platform/api')
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      exceptionFactory: (errors) => {

        throw new BadRequestException()
      }
    }))


  await app.listen(process.env.PORT ?? 5002)
}
bootstrap()
