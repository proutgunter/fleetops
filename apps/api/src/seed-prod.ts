// ══════════════════════════════════════════════
//  seed-prod.ts — Seed pour le premier déploiement
//  Crée les utilisateurs de test + données de référence
//  Exécuter une seule fois : npx ts-node src/seed-prod.ts
// ══════════════════════════════════════════════

import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seed FleetOps — démarrage...');

  const hash = await bcrypt.hash('fleetops2026', 10);

  // ── Utilisateurs ──
  const users = [
    { email: 'admin@fleetops.lu', passwordHash: hash, firstName: 'Admin', lastName: 'FleetOps', role: 'admin', isActive: true },
    { email: 'gestionnaire@fleetops.lu', passwordHash: hash, firstName: 'Marc', lastName: 'Thill', role: 'gestionnaire_transport', isActive: true },
    { email: 'dupont@fleetops.lu', passwordHash: hash, firstName: 'Pierre', lastName: 'Dupont', role: 'conducteur_travaux', isActive: true },
    { email: 'klein@fleetops.lu', passwordHash: hash, firstName: 'Jean', lastName: 'Klein', role: 'conducteur_travaux', isActive: true },
    { email: 'weber@fleetops.lu', passwordHash: hash, firstName: 'Marc', lastName: 'Weber', role: 'chauffeur', isActive: true },
    { email: 'ferreira@fleetops.lu', passwordHash: hash, firstName: 'Antonio', lastName: 'Ferreira', role: 'chauffeur', isActive: true },
    { email: 'dasilva@fleetops.lu', passwordHash: hash, firstName: 'Ricardo', lastName: 'Da Silva', role: 'chauffeur', isActive: true },
    { email: 'rodrigues@fleetops.lu', passwordHash: hash, firstName: 'Luis', lastName: 'Rodrigues', role: 'chauffeur', isActive: true },
    { email: 'schmit@fleetops.lu', passwordHash: hash, firstName: 'Nicolas', lastName: 'Schmit', role: 'chauffeur', isActive: true },
    { email: 'kremer@fleetops.lu', passwordHash: hash, firstName: 'Tom', lastName: 'Kremer', role: 'chauffeur', isActive: true },
  ];

  for (const u of users) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: u,
    });
  }
  console.log(`  ${users.length} utilisateurs créés`);

  // ── Types de véhicules ──
  const vehicleTypes = [
    { code: '2AX', label: '2 axes benne', category: 'benne' },
    { code: '3AX', label: '3 axes', category: 'benne' },
    { code: '4AX', label: '4 axes benne', category: 'benne' },
    { code: '4AG', label: '4 axes grue', category: 'grue' },
    { code: 'BIB', label: 'Bi-benne', category: 'benne' },
    { code: 'CAI', label: 'Caisse', category: 'caisse' },
  ];

  for (const vt of vehicleTypes) {
    await prisma.vehicleType.upsert({
      where: { code: vt.code },
      update: {},
      create: vt,
    });
  }
  console.log(`  ${vehicleTypes.length} types de véhicules créés`);

  // ── Véhicules ──
  const vTypes = await prisma.vehicleType.findMany();
  const getTypeId = (code: string) => vTypes.find(t => t.code === code)?.id || '';

  const vehicles = [
    { code: 'C48', typeId: getTypeId('4AX'), licensePlate: 'LU-C48-001', status: 'active' },
    { code: 'C52', typeId: getTypeId('4AX'), licensePlate: 'LU-C52-002', status: 'active' },
    { code: 'C53', typeId: getTypeId('3AX'), licensePlate: 'LU-C53-003', status: 'active' },
    { code: 'C55', typeId: getTypeId('4AG'), licensePlate: 'LU-C55-004', status: 'active' },
    { code: 'C58', typeId: getTypeId('BIB'), licensePlate: 'LU-C58-005', status: 'active' },
    { code: 'C60', typeId: getTypeId('4AX'), licensePlate: 'LU-C60-006', status: 'active' },
    { code: 'C63', typeId: getTypeId('3AX'), licensePlate: 'LU-C63-007', status: 'maintenance' },
    { code: 'C65', typeId: getTypeId('4AX'), licensePlate: 'LU-C65-008', status: 'reserve' },
    { code: 'C68', typeId: getTypeId('BIB'), licensePlate: 'LU-C68-009', status: 'reserve' },
  ];

  for (const v of vehicles) {
    await prisma.vehicle.upsert({
      where: { code: v.code },
      update: {},
      create: { code: v.code, vehicleTypeId: v.typeId, licensePlate: v.licensePlate, status: v.status },
    });
  }
  console.log(`  ${vehicles.length} véhicules créés`);

  // ── Chantiers ──
  const dupont = await prisma.user.findUnique({ where: { email: 'dupont@fleetops.lu' } });
  const klein = await prisma.user.findUnique({ where: { email: 'klein@fleetops.lu' } });

  const sites = [
    { code: '40215', name: 'Kirchberg T2', address: '2 Rue du Fort Thüngen', city: 'Luxembourg', supervisorId: dupont!.id },
    { code: '40320', name: 'Belval Résidence C', address: "12 Av. du Rock'n'Roll", city: 'Esch-sur-Alzette', supervisorId: dupont!.id },
    { code: '40412', name: 'Strassen Lot 12', address: "45 Route d'Arlon", city: 'Strassen', supervisorId: klein!.id },
    { code: '40510', name: 'Gasperich Bureau A', address: '1 Rue de Gasperich', city: 'Luxembourg', supervisorId: dupont!.id },
    { code: '40612', name: 'Mersch Pont Rail', address: '8 Rue de la Gare', city: 'Mersch', supervisorId: klein!.id },
  ];

  for (const s of sites) {
    await prisma.site.upsert({
      where: { code: s.code },
      update: {},
      create: s,
    });
  }
  console.log(`  ${sites.length} chantiers créés`);

  console.log('Seed terminé.');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
