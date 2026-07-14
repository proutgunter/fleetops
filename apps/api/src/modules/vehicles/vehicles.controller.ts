import { Controller, Get, Post, Patch, Delete, Param, Body, Query } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
@Controller('vehicles')
export class VehiclesController {
  constructor(private prisma: PrismaService) {}
  @Get() findAll(@Query('status') status?: string) {
    return this.prisma.vehicle.findMany({ where: { ...(status && { status }), isActive: true }, include: { vehicleType: true } });
  }
  @Get(':id') findOne(@Param('id') id: string) { return this.prisma.vehicle.findUnique({ where: { id }, include: { vehicleType: true } }); }
  @Post() create(@Body() data: any) { return this.prisma.vehicle.create({ data }); }
  @Patch(':id') update(@Param('id') id: string, @Body() data: any) { return this.prisma.vehicle.update({ where: { id }, data }); }
  @Delete(':id') remove(@Param('id') id: string) { return this.prisma.vehicle.update({ where: { id }, data: { isActive: false } }); }
}
