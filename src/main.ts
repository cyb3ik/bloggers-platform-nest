import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './core/exception-filters/http.exception.filter';
import { ObjectIdValidationPipe } from './core/pipes/object-id-validation.pipe';

export async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.setGlobalPrefix('bloggers-platform/api')
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      stopAtFirstError: true,

      exceptionFactory: (errors) => {
        const errorsRes = errors.map(e => {
          for (let key of Object.keys(e.constraints)) {
            return {
              message: e.constraints[key],
              field: e.property
            }
          }
        })
        throw new BadRequestException(errorsRes)
      }
    }),
    new ObjectIdValidationPipe())

  app.useGlobalFilters(new HttpExceptionFilter())

  await app.listen(process.env.PORT ?? 5002)
}

bootstrap()
