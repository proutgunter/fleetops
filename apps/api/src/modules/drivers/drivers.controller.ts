import { Controller, Get, Query } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
@Controller('drivers')
export class DriversController {
  constructor(private prisma: PrismaService) {}
  @Get() findAll(@Query('available') available?: string) {
    return this.prisma.user.findMany({
      where: { role: 'chauffeur', isActive: true },
      select: { id: true, firstName: true, lastName: true, phone: true, email: true },
    });
  }
}
