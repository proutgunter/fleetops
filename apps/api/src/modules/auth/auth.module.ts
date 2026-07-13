// ══════════════════════════════════════════════
//  Module Auth — Authentification email/mot de passe
//  Génère un JWT à la connexion. Le token contient
//  l'id, l'email et le rôle de l'utilisateur.
//  En production, on basculera sur Microsoft Entra ID.
// ══════════════════════════════════════════════

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'fleetops-dev-secret-change-in-prod',
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || '8h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
