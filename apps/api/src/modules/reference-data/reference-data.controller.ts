import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
@Controller('reference-data')
export class ReferenceDataController {
  constructor(private prisma: PrismaService) {}
  @Get('vehicle-types') vehicleTypes() { return this.prisma.vehicleType.findMany(); }
  @Get('vehicle-accessories') accessories() { return this.prisma.vehicleAccessory.findMany(); }
  @Get('mission-types') missionTypes() { return this.prisma.missionType.findMany(); }
}
