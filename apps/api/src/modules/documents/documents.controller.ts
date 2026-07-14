import { Controller, Get, Post, Patch, Delete, Param, Body, Query } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
@Controller('documents')
export class DocumentsController {
  constructor(private prisma: PrismaService) {}
  @Get() findAll(@Query('vehicleId') vehicleId?: string) {
    return this.prisma.document.findMany({ where: { ...(vehicleId && { vehicleId }) }, include: { vehicle: true }, orderBy: { expiresAt: 'asc' } });
  }
  @Get('expiring') expiring(@Query('days') days?: string) {
    const d = new Date(); d.setDate(d.getDate() + (parseInt(days || '30')));
    return this.prisma.document.findMany({ where: { expiresAt: { lte: d, gte: new Date() } }, include: { vehicle: true }, orderBy: { expiresAt: 'asc' } });
  }
  @Post() create(@Body() data: any) { return this.prisma.document.create({ data }); }
  @Patch(':id') update(@Param('id') id: string, @Body() data: any) { return this.prisma.document.update({ where: { id }, data }); }
  @Delete(':id') remove(@Param('id') id: string) { return this.prisma.document.delete({ where: { id } }); }
}
