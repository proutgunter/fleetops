import { Controller, Get, Post, Patch, Delete, Param, Body, Query } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
@Controller('assignments')
export class AssignmentsController {
  constructor(private prisma: PrismaService) {}

  @Get() findAll(@Query('date') date?: string, @Query('requestId') requestId?: string, @Query('driverId') driverId?: string) {
    return this.prisma.dailyAssignment.findMany({
      where: { ...(date && { date }), ...(requestId && { requestId }), ...(driverId && { driverId }) },
      include: {
        vehicle: { include: { vehicleType: true } },
        driver: { select: { id: true, firstName: true, lastName: true } },
        site: true,
        request: { select: { id: true, description: true, priority: true, missionMode: true } },
        missionType: true,
        subcontractor: true,
      },
      orderBy: [{ startTime: 'asc' }],
    });
  }

  // Vue planning — regroupe par véhicule pour une date donnée
  @Get('planning') async planning(@Query('date') date: string) {
    const assignments = await this.prisma.dailyAssignment.findMany({
      where: { date },
      include: {
        vehicle: { include: { vehicleType: true } },
        driver: { select: { id: true, firstName: true, lastName: true } },
        site: { include: { supervisor: { select: { id: true, firstName: true, lastName: true } } } },
        request: { select: { id: true, description: true, priority: true } },
      },
      orderBy: [{ startTime: 'asc' }],
    });
    // Regrouper par véhicule
    const byVehicle = new Map();
    for (const a of assignments) {
      const key = a.vehicleId;
      if (!byVehicle.has(key)) {
        byVehicle.set(key, { vehicle: a.vehicle, driver: a.driver, missions: [] });
      }
      byVehicle.get(key).missions.push({ id: a.id, site: a.site, startTime: a.startTime, endTime: a.endTime, status: a.status, missionDetails: a.missionDetails, source: a.source, request: a.request });
    }
    return Array.from(byVehicle.values());
  }

  @Get(':id') findOne(@Param('id') id: string) {
    return this.prisma.dailyAssignment.findUnique({ where: { id }, include: { vehicle: { include: { vehicleType: true } }, driver: { select: { id: true, firstName: true, lastName: true } }, site: true, request: true, incidents: true } });
  }

  @Post() create(@Body() data: any) { return this.prisma.dailyAssignment.create({ data }); }
  @Patch(':id') update(@Param('id') id: string, @Body() data: any) { return this.prisma.dailyAssignment.update({ where: { id }, data }); }
  @Delete(':id') remove(@Param('id') id: string) { return this.prisma.dailyAssignment.delete({ where: { id } }); }

  // Chauffeur marque démarré / terminé
  @Post(':id/start') start(@Param('id') id: string) { return this.prisma.dailyAssignment.update({ where: { id }, data: { status: 'started', startedAt: new Date() } }); }
  @Post(':id/complete') complete(@Param('id') id: string) { return this.prisma.dailyAssignment.update({ where: { id }, data: { status: 'completed', completedAt: new Date() } }); }

  // Signaler un incident
  @Post(':id/incident') async reportIncident(@Param('id') id: string, @Body() body: { type: string; description: string }) {
    return this.prisma.incident.create({ data: { assignmentId: id, type: body.type, description: body.description } });
  }
}
