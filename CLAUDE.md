# Nostalgie CI — CLAUDE.md

## Contexte
Refonte du site de Radio Nostalgie CI (1ère radio commerciale privée de Côte d'Ivoire, 101.1 FM Abidjan).
Architecture Next.js 14 App Router sur Vercel — player audio persistant entre les pages, chatbot IA.

## Client
- Nom : Christian Gomis
- Rôle : Programme Director
- Repo GitHub : github.com/christgomis15/nostalgie-ci
- Site live : (à configurer sur Vercel)

## Stack
- Framework : Next.js 14 App Router (TypeScript)
- State player : Zustand (persist entre navigations)
- Chatbot : API Anthropic claude-sonnet-4-20250514 (route `/api/chatbot`)
- Player audio : HTML5 Audio API via Zustand store
- Hébergement : Vercel (déploiement via push GitHub)

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

## Structure des fichiers
```
nostalgie-ci/
├── src/
│   ├── app/
│   │   ├── layout.tsx              ← Root layout (Header + Ticker + PlayerBar)
│   │   ├── globals.css             ← Styles globaux (variables CSS + reset)
│   │   ├── page.tsx                ← Accueil — Hero section
│   │   ├── emissions/page.tsx
│   │   ├── actus/page.tsx
│   │   ├── podcasts/page.tsx
│   │   ├── dedicaces/page.tsx
│   │   ├── contact/page.tsx
│   │   └── api/chatbot/route.ts    ← Anthropic SDK (clé serveur)
│   ├── components/
│   │   ├── Header.tsx              ← 'use client' — nav + pill DIRECT
│   │   ├── WebradioTicker.tsx      ← 'use client' — ticker défilant
│   │   ├── PlayerBar.tsx           ← 'use client' — player bas de page
│   │   └── (à créer)
│   │       ├── ActuModal.tsx       ← modales articles
│   │       └── ChatBot.tsx         ← composant chatbot contact
│   └── lib/
│       └── player-store.ts         ← Zustand store (isPlaying, currentRadio, audio)
├── public/img/                     ← Images (à extraire du base64)
├── _legacy/index.html              ← Monolithe original (référence)
├── .env.local                      ← ANTHROPIC_API_KEY (ne pas committer)
├── .env.local.example
├── next.config.ts
├── package.json
└── CLAUDE.md
```

## Player audio — Architecture
- Store Zustand dans `src/lib/player-store.ts`
- `PlayerBar` et `Header` (pill DIRECT) consomment le store
- Le player persist car `PlayerBar` est dans `layout.tsx` (pas re-monté entre pages)
- Flux HTTPS actif : `https://stream.zeno.fm/01PLpj-2qtzuv` (Nostalgie Live)
- 8 autres webradios → `stream: null` → toast "Bientôt disponible"

## API Chatbot
- Route : `POST /api/chatbot`
- Payload : `{ messages: [{role, content}] }`
- Réponse : `{ reply: string }`
- Clé Anthropic côté serveur uniquement (jamais exposée au client)

## Déploiement
- Méthode : push Git → Vercel détecte automatiquement Next.js
- Variables d'env à configurer sur Vercel : `ANTHROPIC_API_KEY`
- Commandes locales :
  - `npm run dev` — dev sur http://localhost:3000
  - `npm run build` — build de production
  - `npm run start` — serveur de production local

## Variables d'environnement
- `ANTHROPIC_API_KEY` — clé API Anthropic (route chatbot)

## Pages — Statut
| Page       | Fichier                   | Statut        |
|------------|---------------------------|---------------|
| Accueil    | app/page.tsx              | 🚧 squelette  |
| Émissions  | app/emissions/page.tsx    | 🚧 squelette  |
| Actus      | app/actus/page.tsx        | 🚧 squelette  |
| Podcasts   | app/podcasts/page.tsx     | 🚧 squelette  |
| Dédicaces  | app/dedicaces/page.tsx    | 🚧 squelette  |
| Contact    | app/contact/page.tsx      | 🚧 squelette  |
| Chatbot    | app/api/chatbot/route.ts  | ✅ prêt       |