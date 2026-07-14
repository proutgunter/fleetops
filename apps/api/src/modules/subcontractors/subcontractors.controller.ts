import { Controller, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
@Controller('subcontractors')
export class SubcontractorsController {
  constructor(private prisma: PrismaService) {}
  @Get() findAll() { return this.prisma.subcontractor.findMany({ where: { isActive: true } }); }
  @Get(':id') findOne(@Param('id') id: string) { return this.prisma.subcontractor.findUnique({ where: { id } }); }
  @Post() create(@Body() data: any) { return this.prisma.subcontractor.create({ data }); }
  @Patch(':id') update(@Param('id') id: string, @Body() data: any) { return this.prisma.subcontractor.update({ where: { id }, data }); }
  @Delete(':id') remove(@Param('id') id: string) { return this.prisma.subcontractor.update({ where: { id }, data: { isActive: false } }); }
}
