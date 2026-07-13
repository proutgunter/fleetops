// ══════════════════════════════════════════════
//  AuthService — logique d'authentification
// ══════════════════════════════════════════════

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';

export interface JwtPayload {
  sub: string;      // userId
  email: string;
  role: string;
  firstName: string;
  lastName: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  /** Vérifier les identifiants et retourner un token JWT */
  async login(email: string, password: string) {
    // Chercher l'utilisateur par email
    const user = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    // Vérifier le mot de passe
    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    // Générer le JWT
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    const accessToken = this.jwt.sign(payload);

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        initials: `${user.firstName[0]}${user.lastName[0]}`.toUpperCase(),
      },
    };
  }

  /** Récupérer l'utilisateur à partir du payload JWT */
  async validateToken(payload: JwtPayload) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Utilisateur introuvable ou désactivé');
    }

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    };
  }

  /** Hasher un mot de passe (utilisé dans le seed) */
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }
}
