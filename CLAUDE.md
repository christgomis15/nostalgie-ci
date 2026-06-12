# Nostalgie CI — CLAUDE.md

## Contexte
Site de Radio Nostalgie CI (1ère radio commerciale privée de Côte d'Ivoire, 101.1 FM Abidjan).
Next.js App Router sur Vercel — player audio persistant entre les pages, dédicaces et réservations pub via Google Sheets.

## Client
- Nom : Christian Gomis
- Rôle : Programme Director (non-développeur — expliquer simplement, guider pas à pas)
- Repo GitHub : github.com/christgomis15/nostalgie-ci
- Site live : https://nostalgie-ci.vercel.app

## Stack
- Framework : Next.js App Router (TypeScript)
- State player : Zustand (persist entre navigations via layout.tsx)
- Player audio : HTML5 Audio API via Zustand store
- Hébergement : Vercel (déploiement auto sur push main, 2-3 min)
- Backend formulaires : Google Apps Script (webhook → Google Sheet + emails)
- Analytics : @vercel/analytics

## Charte graphique
| Variable CSS | Valeur    | Usage                          |
|-------------|-----------|--------------------------------|
| --or        | #D4A843   | Or — couleur principale        |
| --or-s      | #A07830   | Or sombre — hover boutons      |
| --noir      | #0A0A0A   | Noir profond — fond global     |
| --blanc     | #F5F0E8   | Blanc cassé — texte principal  |
| --g1        | #151515   | Gris 1 — fond header/footer   |
| --g2        | #1E1E1E   | Gris 2 — fond cartes           |
| --g3        | #2A2A2A   | Gris 3 — bordures              |

Police : DM Sans + Playfair Display (Google Fonts)
Slogan : "Sérieusement Décalée."

## Pages — Statut
| Page         | Fichier                       | Statut                                              |
|--------------|-------------------------------|-----------------------------------------------------|
| Accueil      | app/page.tsx                  | ✅ Hero + intro WC2026 (1re visite, 20s)            |
| Intro WC     | app/intro/page.tsx            | ✅ Standalone `/intro`                              |
| Live         | app/live/page.tsx             | ✅ YouTube embed + chat (config: data/live-config)  |
| Émissions    | app/emissions/page.tsx        | ✅ 11 cartes                                        |
| Actus        | app/actus/page.tsx            | ✅ 3 onglets + modal + partage + vidéo              |
| Podcasts     | app/podcasts/page.tsx         | ✅                                                  |
| Dédicaces    | app/dedicaces/page.tsx        | ✅ → /api/dedicaces → Apps Script → Sheet           |
| Contact      | app/contact/page.tsx          | ✅ 3 onglets → /api/contact → Sheet + email         |
| Kit Média    | app/media-kit/page.tsx        | ✅ Page info annonceurs (noindex, hors nav)         |
| Réservation  | app/reserver/page.tsx         | ✅ → /api/reservation → Sheet + email               |
| Chatbot      | —                             | ⛔ Supprimé (coût API) — restaurable via git        |

## Formulaires → Google Apps Script
Toutes les soumissions passent par le même webhook (`GOOGLE_SHEET_WEBHOOK_URL` sur Vercel)
vers le script dont le code source de référence est `APPS_SCRIPT_NOUVEAU.js` (racine du repo).
Le script route selon `data.type` :
- (sans type) → dédicace → feuille principale
- `reservation` → feuille "Réservations" + email assistant.commercial@nostalgie.ci
- `contact_commercial` → feuille "Demandes commerciales" + email assistant.commercial@nostalgie.ci
- `partenariat` → feuille "Partenariats" + email abdair.ndoye@nostalgie.ci

⚠️ Toute modification du script doit être recopiée manuellement par Christian dans
script.google.com (compte nostalgiecotedivoire@gmail.com) puis redéployée via
"Gérer les déploiements → Nouvelle version" (PAS "Nouveau déploiement" — ça change l'URL).
Les appels fetch vers Apps Script utilisent `redirect: 'manual'` et acceptent 200/301/302.

## Prix publicitaires
`src/data/ad-prices.ts` — 9 espaces × 4 durées (semaine/mois/trimestre/semestre), FCFA.

## Player audio
- Store Zustand : `src/lib/player-store.ts`
- Flux : `https://nostalgie.orange.ci/nostalgie2.mp3` (Icecast Orange CI, 128 kbps)
- PlayerBar dans layout.tsx → persiste entre les pages

## Live YouTube
- Config : `src/data/live-config.ts` — mettre `isLive: true` + `videoId`, push, 2-3 min
- Chaîne : youtube.com/@nostalgiecotedivoire8471

## Déploiement
- Push sur `main` → Vercel déploie automatiquement
- PATH git/npm à recharger à chaque session PowerShell :
  `$env:PATH = [System.Environment]::GetEnvironmentVariable("PATH", "Machine") + ";" + [System.Environment]::GetEnvironmentVariable("PATH", "User")`

## Variables d'environnement (Vercel)
- `GOOGLE_SHEET_WEBHOOK_URL` — URL exec du Google Apps Script
