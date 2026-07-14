import { Controller, Get, Post, Patch, Param, Body, Query } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
@Controller('requests')
export class RequestsController {
  constructor(private prisma: PrismaService) {}

  @Get() findAll(@Query('status') status?: string, @Query('siteId') siteId?: string, @Query('requestedById') requestedById?: string) {
    return this.prisma.transportRequest.findMany({
      where: { ...(status && { status }), ...(siteId && { siteId }), ...(requestedById && { requestedById }), deletedAt: null },
      include: { site: true, vehicleType: true, requestedBy: { select: { id: true, firstName: true, lastName: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  @Get(':id') findOne(@Param('id') id: string) {
    return this.prisma.transportRequest.findUnique({
      where: { id },
      include: { site: true, vehicleType: true, requestedBy: { select: { id: true, firstName: true, lastName: true } }, assignments: { include: { vehicle: true, driver: { select: { id: true, firstName: true, lastName: true } } } } },
    });
  }

  @Post() create(@Body() data: any) { return this.prisma.transportRequest.create({ data, include: { site: true, vehicleType: true } }); }

  @Patch(':id') update(@Param('id') id: string, @Body() data: any) {
    return this.prisma.transportRequest.update({ where: { id }, data });
  }

  @Post(':id/cancel') cancel(@Param('id') id: string) {
    return this.prisma.transportRequest.update({ where: { id }, data: { status: 'cancelled' } });
  }
}
