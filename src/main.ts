import { NestFactory } from '@nestjs/core';
import * as csurf from 'csurf';
import { AppModule } from './services/app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
  });
  app.use(csurf());
  await app.listen(process.env.PORT);
}
bootstrap();
