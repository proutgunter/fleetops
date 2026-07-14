// ══════════════════════════════════════════════
//  AppModule — module racine de l'API FleetOps
//  Importe les 14 modules (auth + health + seed + 11 métier)
// ══════════════════════════════════════════════

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { HealthModule } from './modules/health/health.module';
import { SeedModule } from './modules/seed/seed.module';
import { ReferenceDataModule } from './modules/reference-data/reference-data.module';
import { UsersModule } from './modules/users/users.module';
import { VehiclesModule } from './modules/vehicles/vehicles.module';
import { DriversModule } from './modules/drivers/drivers.module';
import { SitesModule } from './modules/sites/sites.module';
import { SubcontractorsModule } from './modules/subcontractors/subcontractors.module';
import { RequestsModule } from './modules/requests/requests.module';
import { AssignmentsModule } from './modules/assignments/assignments.module';
import { AbsencesModule } from './modules/absences/absences.module';
import { MaintenanceModule } from './modules/maintenance/maintenance.module';
import { DocumentsModule } from './modules/documents/documents.module';
import { CostsModule } from './modules/costs/costs.module';
import { ReportsModule } from './modules/reports/reports.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,

    // Infrastructure
    AuthModule,
    HealthModule,
    SeedModule,

    // Référentiel
    ReferenceDataModule,

    // Gestion des ressources
    UsersModule,
    VehiclesModule,
    DriversModule,
    SitesModule,
    SubcontractorsModule,

    // Planification
    RequestsModule,
    AssignmentsModule,

    // Opérations
    AbsencesModule,
    MaintenanceModule,
    DocumentsModule,

    // Suivi
    CostsModule,
    ReportsModule,
  ],
})
export class AppModule {}
