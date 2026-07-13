// ══════════════════════════════════════════════
//  main.ts — Point d'entrée de l'API NestJS
//  CORS configuré pour Vercel, health check pour Render
// ══════════════════════════════════════════════

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Préfixe /api sur toutes les routes
  app.setGlobalPrefix('api');

  // CORS — autoriser le frontend Vercel
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  });

  // Validation des DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  const port = process.env.API_PORT || process.env.PORT || 3000;
  await app.listen(port);
  console.log(`FleetOps API démarrée sur le port ${port}`);
}

bootstrap();
