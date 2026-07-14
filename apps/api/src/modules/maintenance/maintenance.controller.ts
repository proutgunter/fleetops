import { Controller, Get, Post, Patch, Param, Body, Query } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
@Controller('maintenance')
export class MaintenanceController {
  constructor(private prisma: PrismaService) {}
  @Get() findAll(@Query('vehicleId') vehicleId?: string) {
    return this.prisma.maintenanceEvent.findMany({ where: { ...(vehicleId && { vehicleId }) }, include: { vehicle: true }, orderBy: { startDate: 'desc' } });
  }
  @Post() async create(@Body() data: any) {
    const event = await this.prisma.maintenanceEvent.create({ data });
    await this.prisma.vehicle.update({ where: { id: data.vehicleId }, data: { status: 'maintenance' } });
    return event;
  }
  @Patch(':id') async update(@Param('id') id: string, @Body() data: any) {
    const event = await this.prisma.maintenanceEvent.update({ where: { id }, data });
    if (data.endDate) { await this.prisma.vehicle.update({ where: { id: event.vehicleId }, data: { status: 'active' } }); }
    return event;
  }
}
