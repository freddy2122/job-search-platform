# Recherche d'emploi — tableau de bord personnel

Dashboard perso pour piloter la recherche d'emploi (dev web/mobile, télétravail) :

- Les offres du jour arrivent automatiquement via une tâche planifiée (recherche web quotidienne) qui les pousse dans `POST /api/jobs/ingest`.
- Génération en un clic d'un **CV** et d'une **lettre de motivation** (.docx) adaptés à chaque offre, à partir du profil dans [`lib/profile.ts`](lib/profile.ts).
- Suivi de candidature (à postuler / postulé / relancé / entretien / refusé / offre reçue).
- Le bouton **Postuler** ouvre simplement l'offre dans un nouvel onglet — la candidature reste toujours envoyée manuellement par toi.

Stack : Next.js 16 (App Router) + Prisma (SQLite) + Tailwind CSS. SQLite a été choisi pour ne dépendre d'aucun service de base de données externe : un simple fichier suffit, ce qui simplifie beaucoup le déploiement sur de l'hébergement mutualisé.

## Développement local

```bash
npm install
npx prisma migrate dev
npm run dev
```

Configure `.env` (copie de `.env.example`) avec :
- `ADMIN_PASSWORD` — mot de passe de connexion au dashboard
- `SESSION_SECRET` — chaîne aléatoire longue
- `INGEST_TOKEN` — jeton que la tâche planifiée utilisera pour pousser les offres

## Déploiement sur Hostinger (plan Business Web Hosting, Node.js)

1. **Créer l'application Node.js** dans hPanel → *Avancé* → *Node.js*. Choisis une version récente de Node (20 ou +), et le dossier de l'application (ex. `job-search-platform`).
2. **Envoyer le code** : soit via Git (hPanel propose un déploiement Git — connecte un repo GitHub/GitLab où tu auras poussé ce dossier), soit via le gestionnaire de fichiers / SFTP.
3. **Variables d'environnement** : dans l'écran de l'app, ajoute `ADMIN_PASSWORD`, `SESSION_SECRET`, `INGEST_TOKEN`, et `DATABASE_URL=file:/home/u575974999/appdata/emploi/prod.db` — un chemin **en dehors** du dossier déployé, pour que la base survive aux redéploiements Git.
4. **Installer et builder** (hPanel propose un bouton "npm install" / "Run script", sinon en SSH) :
   ```bash
   npm install
   npx prisma migrate deploy
   npm run build
   ```
5. **Démarrage** : la commande de démarrage de l'app Node.js Hostinger doit être `npm start` (= `next start`), sur le port que Hostinger t'assigne (il l'injecte via `PORT`).
6. **Fichier SQLite persistant** : `/home/u575974999/appdata/emploi/` a déjà été créé sur le serveur pour héberger `prod.db`, en dehors du dossier synchronisé par Git — il survivra aux futurs déploiements. Après le tout premier déploiement, lance `npx prisma migrate deploy` (en SSH, dans le dossier de l'app) pour créer les tables dans ce fichier.
7. Une fois le domaine actif (ex. `https://tondomaine.com`), va sur `/login` et connecte-toi avec `ADMIN_PASSWORD`.

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
