// ══════════════════════════════════════════════
//  JwtStrategy — extraction et validation du JWT
// ══════════════════════════════════════════════

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService, JwtPayload } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly auth: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'fleetops-dev-secret-change-in-prod',
    });
  }

  /** Appelé automatiquement après validation du JWT */
  async validate(payload: JwtPayload) {
    return this.auth.validateToken(payload);
  }
}
