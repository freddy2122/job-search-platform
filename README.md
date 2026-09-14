# Recherche d'emploi — tableau de bord personnel

Dashboard perso pour piloter la recherche d'emploi (dev web/mobile, télétravail) :

- Les offres du jour arrivent automatiquement via une tâche planifiée (recherche web quotidienne) qui les pousse dans `POST /api/jobs/ingest`.
- Génération en un clic d'un **CV** et d'une **lettre de motivation** (.docx) adaptés à chaque offre, à partir du profil dans [`lib/profile.ts`](lib/profile.ts).
- Suivi de candidature (à postuler / postulé / relancé / entretien / refusé / offre reçue).
- Le bouton **Postuler** ouvre simplement l'offre dans un nouvel onglet — la candidature reste toujours envoyée manuellement par toi.

Stack : Next.js 16 (App Router) + Prisma (MySQL, via le driver `mariadb` pur JS) + Tailwind CSS. SQLite a été essayé en premier mais abandonné : son binding natif (`better-sqlite3`) ne peut pas se compiler sur l'hébergement mutualisé Hostinger (pas de Python/toolchain disponible dans l'environnement restreint). Le driver `mariadb` est 100% JavaScript, aucune compilation requise, et MySQL est un service de première classe sur ce type d'hébergement.

## Développement local

```bash
npm install
npx prisma migrate dev
npm run dev
```

Configure `.env` (copie de `.env.example`) avec :
- `DATABASE_URL` — chaîne de connexion MySQL, ex. `mysql://user:password@localhost:3306/dbname`
- `ADMIN_PASSWORD` — mot de passe de connexion au dashboard
- `SESSION_SECRET` — chaîne aléatoire longue
- `INGEST_TOKEN` — jeton que la tâche planifiée utilisera pour pousser les offres

## Déploiement sur Hostinger (plan Business Web Hosting)

Le sous-domaine `emploi.acralya.com` et le dépôt GitHub sont déjà connectés via hPanel → *Avancé* → *GIT* (déploiement automatique à chaque push sur `main`). Attention : cette synchronisation Git ne fait que copier les fichiers — elle ne lance ni `npm install`, ni le build, ni le serveur. Il faut en plus :

1. **Créer une base MySQL** : hPanel → *Bases de données* → *Bases de données MySQL* → créer une nouvelle base + un utilisateur avec tous les privilèges dessus. Hostinger préfixe automatiquement les noms (ex. `u575974999_emploi`). Note le nom de la base, l'utilisateur et le mot de passe généré.
2. **Créer l'app Node.js (Passenger)** pour que le site tourne réellement : cherche "Node" dans la barre de recherche de hPanel (l'option n'est pas toujours visible dans le menu *Avancé*) → *Créer une application* :
   - Version Node : **22**
   - Racine de l'application : `domains/acralya.com/public_html/emploi`
   - Domaine : `emploi.acralya.com`
   - Fichier de démarrage : `server.js`
   - Variables d'environnement : `DATABASE_URL`, `ADMIN_PASSWORD`, `SESSION_SECRET`, `INGEST_TOKEN`
3. **Installer, migrer et builder** (en SSH, avec Node 22 activé) :
   ```bash
   source /opt/alt/alt-nodejs22/enable
   cd ~/domains/acralya.com/public_html/emploi
   npm install
   npx prisma migrate deploy
   npm run build
   ```
4. Redémarre l'application depuis l'écran Node.js de hPanel.
5. Va sur `https://emploi.acralya.com/login` et connecte-toi avec `ADMIN_PASSWORD`.

À chaque futur `git push`, hPanel resynchronise les fichiers automatiquement, mais un `npm install` / `npx prisma migrate deploy` / `npm run build` + redémarrage restent nécessaires après si les dépendances ou le schéma ont changé.

## Brancher la recherche quotidienne (routine cloud)

Une routine Claude Code (`trig_01FpYi5M7fiHZKTuqKB6KE4u`) tourne déjà chaque jour à 8h (heure Bénin) et cherche des offres dev web/mobile en télétravail. Une fois le site en ligne, donne l'URL finale à Claude pour qu'il mette à jour cette routine afin qu'elle pousse ses résultats vers :

```
POST https://tondomaine.com/api/jobs/ingest
Authorization: Bearer <INGEST_TOKEN>
Content-Type: application/json

{
  "jobs": [
    {
      "title": "...",
      "company": "...",
      "location": "...",
      "remoteType": "...",
      "salaryMin": 40,
      "salaryMax": 50,
      "stack": "...",
      "url": "https://...",
      "source": "LinkedIn",
      "postedAt": "2026-09-14T00:00:00Z",
      "description": "..."
    }
  ]
}
```

`url` est la clé d'unicité : une offre déjà connue est mise à jour (métadonnées seulement), jamais son statut de suivi.

## Éditer ton profil

Toutes les infos du CV (expériences, compétences, projets, formation) sont dans [`lib/profile.ts`](lib/profile.ts) — modifie ce fichier directement quand ton parcours évolue, la génération de CV/lettre s'appuie dessus.
