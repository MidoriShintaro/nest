import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { FilterException } from './config/FilterException';
import { ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from './config/transform.interceptor';
import { GlobalExceptionFilter } from './config/FilterException';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const httpAdapter = app.get(HttpAdapterHost);
  app.enableCors({ origin: 'http://localhost:3000', credentials: true });
  app.useGlobalFilters(new GlobalExceptionFilter(httpAdapter));
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new TransformInterceptor());

  await app.listen(5000);
}
bootstrap();
