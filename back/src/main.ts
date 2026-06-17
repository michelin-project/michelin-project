import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // Indispensable pour communiquer avec le front Vite (React)
  await app.listen(3000);
}
bootstrap();