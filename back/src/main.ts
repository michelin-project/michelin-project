import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS : si CORS_ORIGIN est défini, on restreint aux origines listées
  // (séparées par des virgules) ; sinon on autorise tout (comportement dev).
  const corsOrigin = process.env.CORS_ORIGIN;
  app.enableCors( 
    corsOrigin ? { origin: corsOrigin.split(',').map((o) => o.trim()) } : {},
  ); // Indispensable pour communiquer avec le front Vite (React)

  const port = Number(process.env.PORT) || 3000;
  await app.listen(port);
  console.log(`🚀 Server running on http://localhost:${port}`);
}
bootstrap();
