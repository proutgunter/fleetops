import { Controller, Post, Get } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

@Controller('seed')
export class SeedController {
  constructor(private prisma: PrismaService) {}

  // GET /api/seed/status — vérifier si la DB est peuplée
  @Get('status')
  async status() {
    const users = await this.prisma.user.count();
    const vehicles = await this.prisma.vehicle.count();
    const sites = await this.prisma.site.count();
    return { seeded: users > 0, counts: { users, vehicles, sites } };
  }

  // POST /api/seed/run — peupler la base avec les données de démo
  @Post('run')
  async run() {
    const existing = await this.prisma.user.count();
    if (existing > 0) return { message: 'Base déjà peuplée', skipped: true };

    const hash = await bcrypt.hash('fleetops2026', 10);

    // ── Utilisateurs ──
    const admin = await this.prisma.user.create({ data: { email: 'admin@fleetops.lu', password: hash, firstName: 'Admin', lastName: 'FleetOps', role: 'admin' } });
    const gestionnaire = await this.prisma.user.create({ data: { email: 'gestionnaire@fleetops.lu', password: hash, firstName: 'Marc', lastName: 'Weber', role: 'gestionnaire' } });
    const cdt1 = await this.prisma.user.create({ data: { email: 'cdtravaux1@fleetops.lu', password: hash, firstName: 'Pierre', lastName: 'Muller', role: 'conducteur' } });
    const cdt2 = await this.prisma.user.create({ data: { email: 'cdtravaux2@fleetops.lu', password: hash, firstName: 'Jean', lastName: 'Schmit', role: 'conducteur' } });
    const ch1 = await this.prisma.user.create({ data: { email: 'chauffeur1@fleetops.lu', password: hash, firstName: 'Luc', lastName: 'Dupont', role: 'chauffeur' } });
    const ch2 = await this.prisma.user.create({ data: { email: 'chauffeur2@fleetops.lu', password: hash, firstName: 'Paul', lastName: 'Martin', role: 'chauffeur' } });
    const ch3 = await this.prisma.user.create({ data: { email: 'chauffeur3@fleetops.lu', password: hash, firstName: 'Thomas', lastName: 'Reuter', role: 'chauffeur' } });
    const ch4 = await this.prisma.user.create({ data: { email: 'chauffeur4@fleetops.lu', password: hash, firstName: 'Romain', lastName: 'Kremer', role: 'chauffeur' } });

    // ── Types de véhicules ──
    const vt2ax = await this.prisma.vehicleType.create({ data: { code: '2AX', label: '2 axes benne', category: 'benne' } });
    const vt3ax = await this.prisma.vehicleType.create({ data: { code: '3AX', label: '3 axes', category: 'benne' } });
    const vt4ax = await this.prisma.vehicleType.create({ data: { code: '4AX', label: '4 axes benne', category: 'benne' } });
    const vt4ag = await this.prisma.vehicleType.create({ data: { code: '4AG', label: '4 axes grue', category: 'grue' } });
    const vtbib = await this.prisma.vehicleType.create({ data: { code: 'BIB', label: 'Bi-benne', category: 'benne' } });
    const vtcai = await this.prisma.vehicleType.create({ data: { code: 'CAI', label: 'Caisse', category: 'caisse' } });

    // ── Accessoires ──
    await this.prisma.vehicleAccessory.createMany({ data: [
      { code: 'REM', label: 'Remorque', compatibleVehicleTypes: [vt2ax.id, vt3ax.id, vt4ax.id, vtbib.id] },
      { code: 'PLT', label: 'Plateau', compatibleVehicleTypes: [vt2ax.id, vt3ax.id, vt4ax.id] },
      { code: 'GRP', label: 'Grappin', compatibleVehicleTypes: [vt4ag.id] },
    ]});

    // ── Types de mission ──
    await this.prisma.missionType.createMany({ data: [
      { code: 'TER', label: 'Terrassement' },
      { code: 'DEM', label: 'Démolition' },
      { code: 'EVA', label: 'Évacuation' },
      { code: 'LIV', label: 'Livraison' },
      { code: 'DIV', label: 'Divers' },
    ]});

    // ── Véhicules ──
    const c48 = await this.prisma.vehicle.create({ data: { code: 'C48', vehicleTypeId: vt4ax.id, licensePlate: 'LU-C48-001', status: 'active' } });
    const c52 = await this.prisma.vehicle.create({ data: { code: 'C52', vehicleTypeId: vt4ax.id, licensePlate: 'LU-C52-002', status: 'active' } });
    const c53 = await this.prisma.vehicle.create({ data: { code: 'C53', vehicleTypeId: vt4ag.id, licensePlate: 'LU-C53-003', status: 'active' } });
    const c55 = await this.prisma.vehicle.create({ data: { code: 'C55', vehicleTypeId: vt3ax.id, licensePlate: 'LU-C55-004', status: 'active' } });
    const c58 = await this.prisma.vehicle.create({ data: { code: 'C58', vehicleTypeId: vtbib.id, licensePlate: 'LU-C58-005', status: 'active' } });
    const c60 = await this.prisma.vehicle.create({ data: { code: 'C60', vehicleTypeId: vt2ax.id, licensePlate: 'LU-C60-006', status: 'reserve' } });
    const c65 = await this.prisma.vehicle.create({ data: { code: 'C65', vehicleTypeId: vtcai.id, licensePlate: 'LU-C65-007', status: 'active' } });
    const c68 = await this.prisma.vehicle.create({ data: { code: 'C68', vehicleTypeId: vt4ax.id, licensePlate: 'LU-C68-008', status: 'active' } });

    // ── Chantiers ──
    const s1 = await this.prisma.site.create({ data: { code: '40215', name: 'Kirchberg T2 - Terrassement', address: 'Avenue J.F. Kennedy', city: 'Luxembourg', supervisorId: cdt1.id } });
    const s2 = await this.prisma.site.create({ data: { code: '40320', name: 'Belval Résidence C', address: 'Boulevard du Jazz', city: 'Esch-sur-Alzette', supervisorId: cdt1.id } });
    const s3 = await this.prisma.site.create({ data: { code: '40418', name: 'Cloche d\'Or - Parking P3', address: 'Rue des Scillas', city: 'Luxembourg', supervisorId: cdt2.id } });
    const s4 = await this.prisma.site.create({ data: { code: '40512', name: 'Differdange - Pont rail', address: 'Rue de l\'Acier', city: 'Differdange', supervisorId: cdt2.id } });

    // ── Demandes de transport ──
    const today = new Date().toISOString().slice(0, 10);
    const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);

    const r1 = await this.prisma.transportRequest.create({ data: {
      siteId: s1.id, vehicleTypeId: vt4ax.id, quantity: 2, missionMode: 'duration', startTime: '07:00', endTime: '16:00',
      description: 'Terrassement zone nord, évacuation terres', priority: 'normal', recurrenceType: 'recurring',
      recurrenceStart: '2026-06-01', recurrenceEnd: '2026-09-30', status: 'assigned', requestedById: cdt1.id,
    }});
    const r2 = await this.prisma.transportRequest.create({ data: {
      siteId: s2.id, vehicleTypeId: vt4ag.id, quantity: 1, missionMode: 'duration', startTime: '08:00', endTime: '12:00',
      description: 'Pose éléments préfabriqués', priority: 'normal', recurrenceType: 'one_time', requestDate: tomorrow,
      status: 'submitted', requestedById: cdt1.id,
    }});
    const r3 = await this.prisma.transportRequest.create({ data: {
      siteId: s3.id, vehicleTypeId: vt3ax.id, quantity: 1, missionMode: 'trips', tripCount: 4,
      description: 'Évacuation gravats parking P3', priority: 'urgent', recurrenceType: 'one_time', requestDate: tomorrow,
      status: 'submitted', requestedById: cdt2.id,
    }});
    const r4 = await this.prisma.transportRequest.create({ data: {
      siteId: s4.id, vehicleTypeId: vtbib.id, quantity: 1, missionMode: 'duration', startTime: '06:30', endTime: '15:00',
      description: 'Apport remblai + évacuation déblais', priority: 'normal', recurrenceType: 'recurring',
      recurrenceStart: '2026-07-01', recurrenceEnd: '2026-12-31', status: 'assigned', requestedById: cdt2.id,
    }});

    // ── Affectations du jour ──
    await this.prisma.dailyAssignment.createMany({ data: [
      { date: today, requestId: r1.id, vehicleId: c48.id, driverId: ch1.id, siteId: s1.id, missionDetails: 'Terrassement zone nord', source: 'auto_renewed', startTime: '07:00', endTime: '16:00', status: 'started' },
      { date: today, requestId: r1.id, vehicleId: c52.id, driverId: ch2.id, siteId: s1.id, missionDetails: 'Évacuation terres vers Colmar', source: 'auto_renewed', startTime: '07:00', endTime: '16:00', status: 'planned' },
      { date: today, requestId: r4.id, vehicleId: c58.id, driverId: ch3.id, siteId: s4.id, missionDetails: 'Apport remblai depuis carrière', source: 'auto_renewed', startTime: '06:30', endTime: '15:00', status: 'planned' },
      { date: today, vehicleId: c65.id, driverId: ch4.id, siteId: s3.id, missionDetails: 'Livraison matériel chantier', source: 'manual', startTime: '08:00', endTime: '10:00', status: 'planned' },
    ]});

    return { message: 'Base peuplée avec succès', counts: { users: 8, vehicleTypes: 6, vehicles: 8, sites: 4, requests: 4, assignments: 4 } };
  }
}
