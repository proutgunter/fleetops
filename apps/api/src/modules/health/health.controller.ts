// ══════════════════════════════════════════════
//  HealthController — endpoint de santé pour Render
// ══════════════════════════════════════════════

import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  check() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }
}
