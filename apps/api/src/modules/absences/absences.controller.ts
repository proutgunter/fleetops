import { Controller, Get, Post, Patch, Delete, Param, Body, Query } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
@Controller('absences')
export class AbsencesController {
  constructor(private prisma: PrismaService) {}
  @Get() findAll(@Query('userId') userId?: string) {
    return this.prisma.absence.findMany({ where: { ...(userId && { userId }) }, include: { user: { select: { id: true, firstName: true, lastName: true } } }, orderBy: { startDate: 'desc' } });
  }
  @Get('date/:date') byDate(@Param('date') date: string) {
    return this.prisma.absence.findMany({ where: { startDate: { lte: date }, endDate: { gte: date } }, include: { user: { select: { id: true, firstName: true, lastName: true, role: true } } } });
  }
  @Post() create(@Body() data: any) { return this.prisma.absence.create({ data }); }
  @Patch(':id') update(@Param('id') id: string, @Body() data: any) { return this.prisma.absence.update({ where: { id }, data }); }
  @Delete(':id') remove(@Param('id') id: string) { return this.prisma.absence.delete({ where: { id } }); }
}
