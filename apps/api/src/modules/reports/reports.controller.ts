import { Controller, Get, Param, Query } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
@Controller('reports')
export class ReportsController {
  constructor(private prisma: PrismaService) {}
  @Get('daily/:date') async daily(@Param('date') date: string) {
    const [assignments, absences] = await Promise.all([
      this.prisma.dailyAssignment.findMany({ where: { date }, include: { vehicle: true, driver: { select: { firstName: true, lastName: true } }, site: true } }),
      this.prisma.absence.findMany({ where: { startDate: { lte: date }, endDate: { gte: date } }, include: { user: { select: { firstName: true, lastName: true } } } }),
    ]);
    return { date, totalAssignments: assignments.length, totalAbsences: absences.length, assignments, absences };
  }
}
