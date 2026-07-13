// ══════════════════════════════════════════════
//  AuthController — endpoints d'authentification
// ══════════════════════════════════════════════

import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

class LoginDto {
  email: string;
  password: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  /** POST /api/auth/login — connexion email/mot de passe */
  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.auth.login(dto.email, dto.password);
  }

  /** GET /api/auth/me — récupérer l'utilisateur connecté */
  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  async me(@Request() req: any) {
    return {
      id: req.user.id,
      email: req.user.email,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      role: req.user.role,
      initials: `${req.user.firstName[0]}${req.user.lastName[0]}`.toUpperCase(),
    };
  }
}
