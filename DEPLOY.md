# FleetOps — Guide de déploiement gratuit

## Vue d'ensemble

| Service | Rôle | Gratuit |
|---------|------|---------|
| **Neon** | Base de données PostgreSQL | 0.5 Go, toujours gratuit |
| **Render** | API backend NestJS | 750h/mois, cold start ~30s |
| **Vercel** | Frontend React | Illimité pour les projets perso |

## Étape 1 — Base de données Neon

1. Va sur **[neon.tech](https://neon.tech)** et crée un compte (GitHub ou email)
2. Clique **"Create a project"**
3. Nom du projet : `fleetops`
4. Région : **eu-central-1** (Frankfurt, le plus proche du Luxembourg)
5. Copie la **connection string** qui s'affiche — elle ressemble à :
   ```
   postgresql://neondb_owner:xxxx@ep-xxxxx.eu-central-1.aws.neon.tech/neondb?sslmode=require
   ```
6. **Garde cette URL**, tu en auras besoin pour Render

## Étape 2 — API sur Render

1. Va sur **[render.com](https://render.com)** et crée un compte (GitHub)
2. Clique **"New" → "Web Service"**
3. Connecte ton dépôt GitHub `fleetops`
4. Configure :
   - **Name** : `fleetops-api`
   - **Region** : Frankfurt (EU Central)
   - **Branch** : `main`
   - **Runtime** : Node
   - **Build Command** :
     ```
     npm install && cd apps/api && npx prisma generate && npx prisma migrate deploy && npm run build
     ```
   - **Start Command** :
     ```
     node apps/api/dist/main.js
     ```
   - **Plan** : Free
5. Dans **Environment Variables**, ajoute :

   | Clé | Valeur |
   |-----|--------|
   | `DATABASE_URL` | *(colle l'URL Neon de l'étape 1)* |
   | `JWT_SECRET` | `fleetops-prod-secret-2026-change-me` |
   | `JWT_EXPIRES_IN` | `8h` |
   | `NODE_ENV` | `production` |
   | `FRONTEND_URL` | *(à remplir après l'étape 3)* |

6. Clique **"Create Web Service"**
7. Attends que le build se termine (~3-5 min)
8. Render te donne une URL comme `https://fleetops-api-xxxx.onrender.com`
9. Teste : ouvre `https://fleetops-api-xxxx.onrender.com/api/health` — tu dois voir `{"status":"ok"}`

**Important** : après le premier déploiement, lance le seed en allant dans Render → ton service → Shell, puis :
```
cd apps/api && npx ts-node src/seed-prod.ts
```

## Étape 3 — Frontend sur Vercel

1. Va sur **[vercel.com](https://vercel.com)** et crée un compte (GitHub)
2. Clique **"Add New" → "Project"**
3. Importe ton dépôt `fleetops`
4. Configure :
   - **Framework Preset** : Vite
   - **Root Directory** : *(laisser vide, la racine du repo)*
   - **Build Command** : `cd apps/web && npm install && npm run build`
   - **Output Directory** : `apps/web/dist`
5. Dans **Environment Variables**, ajoute :

   | Clé | Valeur |
   |-----|--------|
   | `RENDER_API_URL` | `https://fleetops-api-xxxx.onrender.com` *(l'URL de l'étape 2)* |

6. Clique **"Deploy"**
7. Vercel te donne une URL comme `https://fleetops-xxxx.vercel.app`

## Étape 4 — Connecter le tout

1. Retourne dans **Render** → ton service → Environment
2. Mets à jour `FRONTEND_URL` avec l'URL Vercel : `https://fleetops-xxxx.vercel.app`
3. Render redéploie automatiquement

## C'est prêt !

Ouvre l'URL Vercel sur ton PC ou ton téléphone.

**Connexion** : `gestionnaire@fleetops.lu` / `fleetops2026`

Chaque rôle redirige vers son écran :
- Admin ou Gestionnaire → Planning desktop
- Conducteur de travaux → Liste des demandes (mobile)
- Chauffeur → Feuille de route (mobile)

## Notes

- **Cold start Render** : le service gratuit s'endort après 15 min d'inactivité. Le premier accès prend ~30 secondes.
- **Neon** : la base s'endort aussi après 5 min d'inactivité, mais le réveil est quasi-instantané (~1s).
- **Vercel** : le frontend est toujours rapide, il est servi depuis un CDN global.
- Pour passer en production plus tard, il suffira de basculer sur Azure + Entra ID sans changer le code.
