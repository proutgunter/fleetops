import { Controller, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
@Controller('sites')
export class SitesController {
  constructor(private prisma: PrismaService) {}
  @Get() findAll() { return this.prisma.site.findMany({ where: { isActive: true }, include: { supervisor: { select: { id: true, firstName: true, lastName: true } } } }); }
  @Get(':id') findOne(@Param('id') id: string) { return this.prisma.site.findUnique({ where: { id }, include: { supervisor: { select: { id: true, firstName: true, lastName: true } } } }); }
  @Post() create(@Body() data: any) { return this.prisma.site.create({ data }); }
  @Patch(':id') update(@Param('id') id: string, @Body() data: any) { return this.prisma.site.update({ where: { id }, data }); }
  @Delete(':id') remove(@Param('id') id: string) { return this.prisma.site.update({ where: { id }, data: { isActive: false } }); }
}
