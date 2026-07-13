// ══════════════════════════════════════════════
//  AppModule — module racine de l'API FleetOps
// ══════════════════════════════════════════════

import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    HealthModule,
  ],
})
export class AppModule {}
