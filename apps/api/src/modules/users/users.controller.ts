import { Controller, Get, Post, Patch, Delete, Param, Body, Query } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
@Controller('users')
export class UsersController {
  constructor(private prisma: PrismaService) {}
  @Get() findAll(@Query('role') role?: string) {
    return this.prisma.user.findMany({ where: { ...(role && { role }), isActive: true }, select: { id: true, email: true, firstName: true, lastName: true, role: true, phone: true, isActive: true } });
  }
  @Get(':id') findOne(@Param('id') id: string) { return this.prisma.user.findUnique({ where: { id } }); }
  @Post() create(@Body() data: any) { return this.prisma.user.create({ data }); }
  @Patch(':id') update(@Param('id') id: string, @Body() data: any) { return this.prisma.user.update({ where: { id }, data }); }
  @Delete(':id') remove(@Param('id') id: string) { return this.prisma.user.update({ where: { id }, data: { isActive: false } }); }
}
