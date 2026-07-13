// ══════════════════════════════════════════════
//  Seed — Utilisateurs de test
//  Mot de passe par défaut : "fleetops2026"
//  À exécuter après les migrations Prisma
// ══════════════════════════════════════════════

import * as bcrypt from 'bcrypt';

/** Générer les données utilisateurs pour le seed */
export async function getUsersSeedData() {
  const hash = await bcrypt.hash('fleetops2026', 10);

  return [
    {
      email: 'admin@fleetops.lu',
      passwordHash: hash,
      firstName: 'Admin',
      lastName: 'FleetOps',
      role: 'admin',
      isActive: true,
    },
    {
      email: 'gestionnaire@fleetops.lu',
      passwordHash: hash,
      firstName: 'Marc',
      lastName: 'Thill',
      role: 'gestionnaire_transport',
      isActive: true,
    },
    {
      email: 'dupont@fleetops.lu',
      passwordHash: hash,
      firstName: 'Pierre',
      lastName: 'Dupont',
      role: 'conducteur_travaux',
      isActive: true,
    },
    {
      email: 'klein@fleetops.lu',
      passwordHash: hash,
      firstName: 'Jean',
      lastName: 'Klein',
      role: 'conducteur_travaux',
      isActive: true,
    },
    {
      email: 'weber@fleetops.lu',
      passwordHash: hash,
      firstName: 'Marc',
      lastName: 'Weber',
      role: 'chauffeur',
      isActive: true,
    },
    {
      email: 'ferreira@fleetops.lu',
      passwordHash: hash,
      firstName: 'Antonio',
      lastName: 'Ferreira',
      role: 'chauffeur',
      isActive: true,
    },
    {
      email: 'dasilva@fleetops.lu',
      passwordHash: hash,
      firstName: 'Ricardo',
      lastName: 'Da Silva',
      role: 'chauffeur',
      isActive: true,
    },
  ];
}
