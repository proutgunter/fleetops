import { Controller, Get, Post, Param, Body, Query } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
@Controller('costs')
export class CostsController {
  constructor(private prisma: PrismaService) {}
  @Get() findAll(@Query('vehicleId') vehicleId?: string, @Query('category') category?: string) {
    return this.prisma.costEntry.findMany({ where: { ...(vehicleId && { vehicleId }), ...(category && { category }) }, include: { vehicle: true }, orderBy: { date: 'desc' } });
  }
  @Post() create(@Body() data: any) { return this.prisma.costEntry.create({ data }); }
}
